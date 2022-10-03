import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import { createStandaloneToast } from '@chakra-ui/toast'
import { BrowserRouter } from 'react-router-dom';

import './index.scss';

const { ToastContainer } = createStandaloneToast();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer />
    </BrowserRouter>
  </Provider>
);
