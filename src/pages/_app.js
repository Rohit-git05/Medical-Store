import '../styles/globals.css';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { CartProvider } from '../context/CartContext';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeProvider>
          <Component {...pageProps} />
        </ThemeProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
// Default client export wrapper
