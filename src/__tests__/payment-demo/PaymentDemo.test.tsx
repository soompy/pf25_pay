import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { PaymentDemo } from '@/features/payment-demo/components/PaymentDemo';
import { createPaymentClient } from '@/features/payment-demo/paymentClient';
import { processPayment } from '@/features/payment-demo/server/processPayment';

jest.mock('next/link', () => {
  const Link = ({ children, href, ...rest }: { children: React.ReactNode; href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  );
  return Link;
});

function setup() {
  jest.useFakeTimers();
  // Stand-in for the API route: same processing logic, delivered over a fake fetch after 500ms.
  const fetchImpl = jest.fn((_url: string, init: RequestInit) => {
    const result = processPayment(JSON.parse(String(init.body)), { generateOrderId: () => 'DEMO-20261109-TEST01' });
    return new Promise<Response>((resolve) =>
      setTimeout(() => resolve({ ok: true, status: 200, json: () => Promise.resolve(result) } as Response), 500),
    );
  });
  const service = createPaymentClient({ fetchImpl });
  const paySpy = jest.spyOn(service, 'pay');
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  render(
    <LanguageProvider>
      <PaymentDemo service={service} />
    </LanguageProvider>,
  );
  return { user, paySpy, fetchImpl };
}

async function fillDetails(user: ReturnType<typeof userEvent.setup>, method: RegExp) {
  await user.click(screen.getByRole('radio', { name: /무선 이어폰/ }));
  await user.click(screen.getByRole('radio', { name: method }));
  await user.click(screen.getByRole('checkbox'));
  await user.click(screen.getByRole('button', { name: '주문 확인하기' }));
}

const finishPayment = () => act(() => jest.advanceTimersByTimeAsync(600));

afterEach(() => jest.useRealTimers());

describe('PaymentDemo', () => {
  it('shows field errors and an error summary when submitting an empty form', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: '주문 확인하기' }));

    const summary = screen.getByRole('alert');
    expect(summary).toHaveFocus();
    expect(within(summary).getAllByRole('listitem')).toHaveLength(3);
    expect(screen.getAllByText('상품을 선택해 주세요.').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: '주문 정보' })).toBeInTheDocument();
  });

  it('completes a successful payment and shows the order number', async () => {
    const { user, paySpy } = setup();
    await fillDetails(user, /테스트 카드 · 승인/);

    expect(screen.getByRole('heading', { name: '주문 내역을 확인해 주세요' })).toHaveFocus();
    const payButton = screen.getByRole('button', { name: /89,000 결제하기/ });
    await user.click(payButton);

    expect(screen.getByRole('heading', { name: '결제를 처리하고 있어요' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('결제를 처리하고 있습니다.');

    await finishPayment();
    expect(screen.getByRole('heading', { name: '결제가 완료되었습니다' })).toHaveFocus();
    expect(screen.getByText('DEMO-20261109-TEST01')).toBeInTheDocument();
    expect(paySpy).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: '새 결제 시작' }));
    expect(screen.getByRole('radio', { name: /무선 이어폰/ })).not.toBeChecked();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('sends only one request on a rapid double click', async () => {
    const { user, paySpy, fetchImpl } = setup();
    await fillDetails(user, /테스트 카드 · 승인/);
    const payButton = screen.getByRole('button', { name: /결제하기/ });
    await act(async () => {
      payButton.click();
      payButton.click();
    });
    await finishPayment();
    expect(paySpy).toHaveBeenCalledTimes(1);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('keeps input after a failure and succeeds on retry', async () => {
    const { user, paySpy } = setup();
    await fillDetails(user, /테스트 카드 · 일시 오류/);
    await user.click(screen.getByRole('button', { name: /결제하기/ }));
    await finishPayment();

    expect(screen.getByRole('heading', { name: '결제에 실패했습니다' })).toBeInTheDocument();
    expect(screen.getByText(/일시적인 오류/, { selector: 'p' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '다시 시도' }));
    await finishPayment();
    expect(screen.getByRole('heading', { name: '결제가 완료되었습니다' })).toBeInTheDocument();
    expect(paySpy).toHaveBeenCalledTimes(2);
    expect(paySpy.mock.calls[1][0].attempt).toBe(2);
  });

  it('returns to details with input kept when editing after a decline', async () => {
    const { user } = setup();
    await fillDetails(user, /테스트 카드 · 거절/);
    await user.click(screen.getByRole('button', { name: /결제하기/ }));
    await finishPayment();

    await user.click(screen.getByRole('button', { name: '주문 정보 수정' }));
    expect(screen.getByRole('radio', { name: /무선 이어폰/ })).toBeChecked();
    expect(screen.getByRole('radio', { name: /테스트 카드 · 거절/ })).toBeChecked();
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('updates the total as quantity changes', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('radio', { name: /스페셜티 원두/ }));
    // 18,900 + 3,000 shipping
    expect(screen.getByText('₩21,900')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '수량 늘리기' }));
    expect(screen.getByRole('spinbutton', { name: '수량' })).toHaveValue(2);
    expect(screen.getByText('₩40,800')).toBeInTheDocument();
  });
});
