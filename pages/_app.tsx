import React from 'react';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from "../components/layout";
import initAuth from '../initAuth';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';


initAuth();

export default function App({ Component, pageProps }: AppProps) {
  const [verifyEmail, setVerifyEmail] = useState(false);
  return (
    <Layout>
      <Component {...pageProps} setVerifyEmail={setVerifyEmail} />
      <Modal show={verifyEmail}>
        <Modal.Header >
          <Modal.Title>Please check your email and follow the verification link to verify your account.</Modal.Title>
          {/* TODO: Add link to resend verification email and prevent refresh workaround*/}
        </Modal.Header>
      </Modal>
    </Layout>
  );
}
