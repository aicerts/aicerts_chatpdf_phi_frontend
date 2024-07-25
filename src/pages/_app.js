import 'bootstrap/dist/css/bootstrap.min.css';
import "../../assets/css/styles.scss";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Router from 'next/router';
import DataContext from '@/utils/DataContext';
import NProgress from 'nprogress'; // Import NProgress
import 'nprogress/nprogress.css'; // Import NProgress styles

const App = ({ Component, pageProps }) => {
  const router = useRouter();
  const [pdfData, setPdfData] = useState("")
  const [sourceId, setSourceId] = useState("")
  const [chatMessage, setChatMessage] = useState([])
  const [pdfList, setPdfList] = useState([])
  const [selectedPdf, setSelectedPdf] = useState(null)
  const [selectedTab, setSelectedTab] = useState(null)
  const [folders, setFolders] = useState([]);
  useEffect(() => {
    const start = () => NProgress.start();
    const end = () => NProgress.done();

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  return (
    <DataContext.Provider value={{setFolders:setFolders,folders:folders,pdfData:pdfData,setPdfData:setPdfData, sourceId:sourceId,setSourceId:setSourceId,chatMessage:chatMessage,setChatMessage:setChatMessage,selectedPdf:selectedPdf,setSelectedPdf:setSelectedPdf,selectedTab:selectedTab,setSelectedTab:setSelectedTab,pdfList:pdfList,setPdfList:setPdfList }}>
      <Component {...pageProps} />
    </DataContext.Provider>
  );
}

export default App;