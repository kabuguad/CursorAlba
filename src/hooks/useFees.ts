import { useQuery, useMutation } from '@tanstack/react-query'
import { fetchFeeStatement, initiatePayment } from '../api/fees'
import { useToast } from '../contexts/ToastContext'

export function useFeeStatement(studentId: string) {
  return useQuery({
    queryKey: ['fees', studentId],
    queryFn: () => fetchFeeStatement(studentId),
    enabled: !!studentId,
  })
}

export function useInitiatePayment() {
  const { showToast } = useToast()

  return useMutation({
    mutationFn: initiatePayment,
    onSuccess: (data) => {
      showToast(`M-Pesa STK Push sent — Ref: ${data.reference}`)
    },
    onError: () => {
      showToast('Payment initiation failed. Please try again.')
    },
  })
}
