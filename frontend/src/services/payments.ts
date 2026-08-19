export const createPaymentIntent = async (amount: number) => {
  return Promise.resolve({ clientSecret: `mock_client_secret_${amount}` })
}
