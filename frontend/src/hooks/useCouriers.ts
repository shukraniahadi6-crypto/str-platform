import { useMemo } from 'react'
import { mockCouriers, mockUsers } from '../data/mockData'

export const useCouriers = () => {
  return useMemo(
    () =>
      mockCouriers.map((courier) => ({
        ...courier,
        profile: mockUsers.find((u) => u.id === courier.userId),
      })),
    [],
  )
}
