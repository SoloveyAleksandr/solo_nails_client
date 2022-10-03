import { FC } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';

import styles from './ModalContainer.module.scss';

interface IModalConteiner {
  isOpen: boolean,
  onClose: () => void,
  children: React.ReactNode,
}

const ModalConteiner: FC<IModalConteiner> = ({
  isOpen,
  onClose,
  children,
}) => {

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered={true} >
      <ModalOverlay
        className={styles.modalOverlay} />
      <ModalContent
        w={'calc(100% - 30px)'}
        maxW={'calc(450px)'}>
        <ModalHeader></ModalHeader>
        <ModalCloseButton color={'#000'} />
        <ModalBody pb={6}>
          {children}
        </ModalBody>

      </ModalContent>
    </Modal>
  );
};

export default ModalConteiner;
