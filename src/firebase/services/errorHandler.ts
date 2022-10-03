import { useToast } from '@chakra-ui/react';

export const useErrorHandler = () => {
  const toast = useToast();
  const authError = (e: any) => {
    toast({
      title: 'Произошла ошибка',
      status: 'error',
      isClosable: true,
      duration: 5000,
      position: 'top'
    });
  }

  return {
    authError,
  }
}