import React from 'react';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from "../components/layout";
import initAuth from '../initAuth';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { useAuthUser } from 'next-firebase-auth';


initAuth();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
