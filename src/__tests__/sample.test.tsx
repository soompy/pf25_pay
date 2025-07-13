import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('샘플 테스트', () => {
  it('테스트 환경이 올바르게 설정되었는지 확인', () => {
    render(<div>SafePay 테스트</div>)
    expect(screen.getByText('SafePay 테스트')).toBeInTheDocument()
  })
})