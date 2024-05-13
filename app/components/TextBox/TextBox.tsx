import React from 'react'
import styles from './TextBox.module.css'
import { platform } from 'os'

type TextBoxProps = {
    placeholder: string
    nameBtn: string
    inputValue: string
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
    handleFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const TextBox: React.FC<TextBoxProps> = ({ placeholder, nameBtn, inputValue, handleInputChange, handleFormSubmit }) => {
  return (
    <form action="" onSubmit={handleFormSubmit}>
        <div className={styles.inputContainer}>
          <textarea
            className={styles.addCollectionTextarea}
            rows={7}
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
          />
          <button
            className="btn absolute right-0 top-2 h-2 translate-x-[-15%] p-4"
            type="submit"
          >
            {nameBtn}
          </button>
        </div>
      </form>
  )
}

export default TextBox