import AppRouter from "./AppRouter";
import { resetCurrentUserInfo, setIsLogged, setLoading } from "./store";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import BGContainer from "./components/BGContainer/BGContainer";
import Spiner from "./components/Spiner/Spiner";
import { ChakraProvider } from "@chakra-ui/react";
import { authentification } from "./firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useToast } from '@chakra-ui/react';
import useAuth from "./firebase/controllers/userController";
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const reduxDispatch = useAppDispatch();
  const appState = useAppSelector(state => state.AppStore);
  const toast = useToast();
  const { getCurrentUser } = useAuth();

  const location = useLocation();

  onAuthStateChanged(authentification, async (user) => {
    try {
      if (user) {
        if (!appState.isLogged) {
          reduxDispatch(setIsLogged(true));
        }
      } else if (!user && appState.isLogged) {
        reduxDispatch(setIsLogged(false));
      }
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    if (appState.isLogged) {
      (async () => {
        try {
          await getCurrentUser();
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [appState.isLogged]);

  useEffect(() => {
    if (appState.isLogged) {
      if (appState.currentUserInfo.name &&
        appState.currentUserInfo.instagram) {
        toast({
          title: `Здравствуйте, ${appState.currentUserInfo.name}`,
          status: 'success',
          isClosable: true,
          duration: 5000,
          position: 'top',
        });
        return;
      } else if (!appState.currentUserInfo.name) {
        toast({
          title: 'Здравствуйте, пожалуйста, добавьте свое ИМЯ в профиль',
          status: 'warning',
          isClosable: true,
          duration: 30000,
          position: 'top',
        });
        return;
      } else if (!appState.currentUserInfo.instagram) {
        toast({
          title: 'Здравствуйте, пожалуйста, добавьте свой INSTARGAM в профиль',
          status: 'warning',
          isClosable: true,
          duration: 30000,
          position: 'top',
        });
        return;
      }
    }
  }, [appState.currentUserInfo.uid]);

  // useEffect(() => {
  //отключение слушателя сервера
  // console.log(location.pathname);
  // }, [location])

  return (
    <ChakraProvider>
      <Spiner />
      <BGContainer>
        <AppRouter />
      </BGContainer>
    </ChakraProvider>
  );
}

export default App;
