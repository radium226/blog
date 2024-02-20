import { ReactNode } from 'react';


export interface StrongProps {
    children: ReactNode,
}

export default function String({ children }: StrongProps) {
    return (
        <strong>{ children }</strong>
    )
}