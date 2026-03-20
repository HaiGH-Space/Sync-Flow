export const ORDER_STEP = 1000;

export type OrderedEntity = {
    id: string;
    order: number;
};

export function getTailOrder(lastOrder?: number, step = ORDER_STEP): number {
    return typeof lastOrder === 'number' ? lastOrder + step : step;
}

export function getInsertOrder(
    prevOrder: number | undefined,
    nextOrder: number | undefined,
    step = ORDER_STEP,
): { order: number; requiresRebalance: boolean } {
    if (prevOrder === undefined && nextOrder === undefined) {
        return { order: step, requiresRebalance: false };
    }

    if (prevOrder === undefined) {
        return { order: (nextOrder as number) - step, requiresRebalance: false };
    }

    if (nextOrder === undefined) {
        return { order: prevOrder + step, requiresRebalance: false };
    }

    const midpoint = Math.trunc((prevOrder + nextOrder) / 2);
    const requiresRebalance = midpoint === prevOrder || midpoint === nextOrder;

    return { order: midpoint, requiresRebalance };
}

export function rebalanceOrders<T extends OrderedEntity>(items: T[], step = ORDER_STEP): T[] {
    return items.map((item, index) => ({
        ...item,
        order: (index + 1) * step,
    }));
}
