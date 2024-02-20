import { PropsWithChildren } from 'react';

export interface StrongProps {
}

export default function Strong({ children }: PropsWithChildren<StrongProps>) {
    return (
        <strong>{ children }</strong>
    )
}