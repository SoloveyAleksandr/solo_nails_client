import React, { FC } from "react";
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';
import { InfoIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
} from '@chakra-ui/react'

import styles from './FormInput.module.scss';

interface IFormInput {
  title: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addon?: string;
  info?: string;
}

const FormInput: FC<IFormInput> = ({
  title,
  placeholder,
  value,
  onChange,
  addon,
  info,
}) => {

  return (
    <InputGroup w={'100%'}>
      <label className={styles.label}>
        <span className={styles.title}>
          {title}
        </span>
        {info &&
          <Popover placement='auto-start'>
            <PopoverTrigger>
              <button
                type="button"
                className={styles.infoBtn}>
                <InfoIcon />
              </button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody
                p={'30px 5px 5px 5px'}
                boxShadow={'0 0 5px #000'}>
                {info}
              </PopoverBody>
            </PopoverContent>
          </Popover>
        }
        <div className={styles.inputWrapper}>
          {addon &&
            <InputLeftAddon
              border={'2px'}
              borderColor={'rgba(15, 15, 15, 1)'}
              bgColor={'rgba(255, 255, 255, 0.5)'}
              fontSize={'16px'}
              className={styles.phoneAddon}
              children='+375' />}
          <Input
            outline={'none'}
            border={'2px'}
            borderColor={'rgba(15, 15, 15, 1)'}
            className={addon ? `${styles.input} ${styles.addon}` : styles.input}
            placeholder={placeholder}
            value={value}
            fontSize={'16px'}
            onChange={e => onChange(e)} />
        </div>
      </label>
    </InputGroup>
  );
};

export default FormInput;
