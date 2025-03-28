import Typewritter from 'typewriter-effect';
import { useState, useEffect} from 'react';

type TextResponseAreaProps = {
    response: string

}

export const TextResponseArea = ({ response }: TextResponseAreaProps) => {
    const [text, setText] = useState<string>('');
   useEffect(() => {
    setText(response)
     }, [response])

    return (
        <Typewritter
            options={{ strings: text, autoStart: true, cursor: '_', delay: 50, loop: false, stringSplitter: (text) => [...text], }} />
    )
}