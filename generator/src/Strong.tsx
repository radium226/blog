import { PropsWithChildren, useEffect } from 'react';

export interface StrongProps {
}

export default function Strong({ children }: PropsWithChildren<StrongProps>) {
    useEffect(() => {
        alert("Salut les petzouz! ")
    })
    return (
        <strong onClick={ () => alert("Coucou") }>{ children }</strong>
    )
}