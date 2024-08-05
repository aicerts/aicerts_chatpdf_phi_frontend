import { createContext } from "react";

const DataContext = createContext({
    pdfData:"",
    sourceId:"",
    chatMessage:[],
    selectedPdf:null,
    pdfList:[],
    selectedTab:"",
    folders:[]
})

export default DataContext;