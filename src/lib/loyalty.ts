export const LOYALTY_TIERS = {
    MEMBER: {
        name: 'Member',
        threshold: 0,
        rate: 0.05 // 5%
    },
    VIP: {
        name: 'VIP',
        threshold: 10000,
        rate: 0.07 // 7%
    },
    VVIP: {
        name: 'VVIP',
        threshold: 50000,
        rate: 0.10 // 10%
    }
}

export function getRank(points: number) {
    if (points >= LOYALTY_TIERS.VVIP.threshold) return LOYALTY_TIERS.VVIP
    if (points >= LOYALTY_TIERS.VIP.threshold) return LOYALTY_TIERS.VIP
    return LOYALTY_TIERS.MEMBER
}

export function calculatePoints(totalPrice: number, currentPoints: number) {
    const rank = getRank(currentPoints)
    const points = Math.floor(totalPrice * rank.rate)
    return { points, rank: rank.name }
}
