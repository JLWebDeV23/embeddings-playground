import React, { useState } from 'react'
import styles from './LogProb.module.css'
import TextBox from '../TextBox/TextBox'

const LogProb = () => {
    const [inputValue, setInputValue] = useState<string>("");
    
    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {

    }

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {}

  return (
    <section className={styles.logprob}>
        <TextBox placeholder='Type something...' nameBtn="Add" inputValue={inputValue} handleInputChange={handleInputChange} handleFormSubmit={handleFormSubmit} />
    </section>
  )
}

export default LogProb