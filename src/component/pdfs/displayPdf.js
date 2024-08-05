import React, { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

const DisplayPdf = ({ url, scale, searchQuery }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [dragStart, setDragStart] = useState(null);
    const [dragging, setDragging] = useState(false);
    const containerRef = useRef(null);
    const documentRef = useRef(null);
    const [searchResults, setSearchResults] = useState([]);

    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

    const handlePageChange = newPageNumber => {
        setPageNumber(newPageNumber);
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        if (numPages) {
            setNumPages(numPages);
        } else {
            console.error('Error loading PDF document');
        }
    };

    const handleMouseDown = e => {
        setDragStart({ x: e.clientX, y: e.clientY });
        setDragging(true);
    };

    const handleMouseMove = e => {
        if (!dragging || !dragStart) return;
        const { clientX, clientY } = e;
        const deltaX = clientX - dragStart.x;
        const deltaY = clientY - dragStart.y;
        containerRef.current.scrollLeft -= deltaX;
        containerRef.current.scrollTop -= deltaY;
        setDragStart({ x: clientX, y: clientY });
    };

    const handleMouseUp = () => {
        setDragging(false);
    };

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        console.log(url,"url")
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dragging, dragStart]);

    useEffect(() => {
        if (searchQuery) {
            searchPdf();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    return (
        <>
            <div
                ref={containerRef}
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    position: 'relative',
                    border: '1px solid #ccc',
                    cursor: dragging ? "grabbing" : ""
                }}
                onMouseDown={handleMouseDown}
            >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
                        {Array.from({ length: numPages || 0 }, (_, i) => (
                            <Page key={`page-${i + 1}`} pageNumber={i + 1} scale={scale} renderTextLayer={false} />
                        ))}
                    </Document>
                </div>
            </div>
        </>
    );
};

export default DisplayPdf;
