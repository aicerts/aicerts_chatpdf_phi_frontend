import React, { useContext, useEffect, useState } from "react";
import DataContext from "@/utils/DataContext";
import chatPDF from "@/services/ChatPDF";
import { useRouter } from "next/router";
import allCommonApis from "@/services/Common";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generatePresignedUrl } from "@/utils/common";
import { Modal, Form, InputGroup } from "react-bootstrap";
import Image from "next/image";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import useToggleSessionStorage from '@/hooks/sessionStorage';

const OptionSection = ({ setIsLoading, isLoading, onSendData, onSelectFolder }) => {
  const router = useRouter();
  const {
    setPdfList,
    folders,
    setFolders,
    pdfList,
    setSelectedPdf,
    setSourceId,
    sourceId,
    setChatMessage,
    chatMessage,
    selectedPdf,
    selectedTab,
    setSelectedTab,
  } = useContext(DataContext);
  const [user, setUser] = useState({});
  const [show, setShow] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [folder_id, setFolder_id] = useState("");
  const [draggingFile, setDraggingFile] = useState(null);
  const [dragOverFolderId, setDragOverFolderId] = useState(null);  
  // State to manage folder visibility
  const [folderKbName, setFolderKbName] = useState('');
  const [sessionData, setSessionData] = useToggleSessionStorage('folderSelected', {});
  const [activeFolderIndex, setActiveFolderIndex] = useState(null);
  const [isChecked, setIsChecked] = useState(new Array(folders.length).fill(false));
  // const [selectedFolder, setSelectedFolder] = useState(null);

  // Effect to filter files and folders based on search input
  useEffect(() => {
    if (typeof inputValue === "string") {
      if (inputValue === "") {
        // If search input is empty, display all files and folders
        setFolders(folders);
      } else {
        // Filter files and folders based on search input
        const filtered = folders
          .map((folder) => {
            const filteredFiles = folder?.files?.filter(
              (file) =>
                typeof file?.name === "string" &&
                file.name.toLowerCase().includes(inputValue.toLowerCase())
            );
            if (filteredFiles.length > 0) {
              return {
                ...folder,
                files: filteredFiles,
              };
            }
            return null;
          })
          .filter((folder) => folder !== null);
          setFolders(filtered);
      }
    }
  }, [inputValue, folders]);

  // Handler for search input change
  const handleSearchInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClick = (index) => {
    if (activeFolderIndex === index) {
      setActiveFolderIndex(-1);
    } else {
      setActiveFolderIndex(index);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage?.getItem("User"));
    if (user) {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    // Retrieve data from sessionStorage
    const storedSelectedTab = sessionStorage.getItem("selectedTab");
    const storedSelectedPdf = sessionStorage.getItem("selectedPdf");
    const storedSourceId = sessionStorage.getItem("sourceId");
    const storedFolderKbName = sessionStorage.getItem("folderKbName");
    setFolderKbName(storedFolderKbName)

    // Update states if data is found in sessionStorage
    if (storedSelectedTab) {
      setSelectedTab(storedSelectedTab);
    }
    if (storedSelectedPdf) {
      setSelectedPdf(storedSelectedPdf);
    }
    if (storedSourceId) {
      setSourceId(storedSourceId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClose = () => {
    setShow(false);
    setInputValue(""); // Clear input value when closing modal
  };

  const handleDragOverFolder = (folderId) => {
    setDragOverFolderId(folderId);
  };

  const handleDragLeaveFolder = () => {
    setDragOverFolderId(null);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    console.log(active, over)
    setDraggingFile(null);
    if (over && active.data.current.file && over.data.current.folder) {
      const fileId = active.id;
      const newFolderId = over.id;
      const response = await allCommonApis(
        `/File/change-folder/${fileId}`,
        "put",
        { folder_id: newFolderId }
      );
      if (response.status === 200) {
        fetchPDFList()
      } else {
        // Handle other cases where the status is not SUCCESS
        console.error("Error fetching PDF list:", response.error);
        setIsLoading(false);
      }

    }

  };

  const fetchPDFList = async () => {
    const user = JSON.parse(localStorage?.getItem("User"));
    try {
      const response = await allCommonApis(`/Folder/get-all-folders/${user._id}`);
      if (response.status === 200) {
        setPdfList(response.data.data);
        let selectedTabFromSession = sessionStorage.getItem("selectedTab");
        let selectedPdfFromSession = sessionStorage.getItem("selectedPdf");
        let sourceIdFromSession = sessionStorage.getItem("sourceId");

        if (selectedTabFromSession && selectedPdfFromSession && sourceIdFromSession) {
          setSelectedTab(selectedTabFromSession);
          setSelectedPdf(selectedPdfFromSession);
          setSourceId(sourceIdFromSession);
        } else if (response.data.data[0]?.files[0]) {
          const url = await generatePresignedUrl(response.data.data[0].files[0].fileUrl);
          setSelectedTab(response.data.data[0].files[0]._id);
          setSelectedPdf(url);
          setSourceId(response.data.data[0].files[0].sourceId);
          sessionStorage.setItem("selectedTab", response.data.data[0].files[0]._id);
          sessionStorage.setItem("selectedPdf", url);
          sessionStorage.setItem("sourceId", response.data.data[0].files[0].sourceId);
        }

        const modifiedData = response.data.data.map((item) => {
          return {
            folder: item.folder.name === "___default___" ? { ...item.folder, name: "Default" } : item.folder,
            files: item.files,
            isOpen: false,
          };
        });

        const sortedFolders = modifiedData.sort((a, b) => {
          if (a.folder.name === "Default") return -1;
          if (b.folder.name === "Default") return 1;
          return 0;
        });

        setFolders(sortedFolders);
      } else {
        console.error("Error fetching PDF list:", response.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching PDF list:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPDFList();
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);

  const toggleFolder = (index) => {
    const updatedFolders = folders.map((folder, i) => ({
      ...folder,
      isOpen: i === index ? !folder.isOpen : false,
    }));
    setFolders(updatedFolders);   
  };

  // const handleSelectFolder = (index) => {
  //   setActiveFolderIndex(index)
  //   const selectedFolder = folders[index];
  //   const folderKbName = folders[index]?.folder?.kb_Name;  
  //   if (sessionStorage.getItem('folderKbName') === folderKbName) {
  //     sessionStorage.removeItem('folderKbName');
  //     sessionStorage.removeItem('selectedFolder');
  //     setSessionData(false);
  //     setIsChecked(false)
  //     setActiveFolderIndex(null);
  //   } else {
  //     sessionStorage.setItem('folderKbName', folderKbName);
  //     onSelectFolder(selectedFolder)
  //     setSessionData(true);
  //     setActiveFolderIndex(index)
  //     setIsChecked(true)
  //   }
  //   onSendData(sessionData);
  //   setIsChecked(sessionData)
  // }

  const handleSelectFolder = (index) => {
    const newIsChecked = new Array(folders.length).fill(false);
    newIsChecked[index] = !newIsChecked[index];
    setIsChecked(newIsChecked);
    setActiveFolderIndex(newIsChecked[index] ? index : null);

    const selectedFolder = folders[index];
    const folderKbName = folders[index]?.folder?.kb_Name;

    if (newIsChecked[index]) {
      sessionStorage.setItem('folderKbName', folderKbName);
      onSelectFolder(selectedFolder);
    } else {
      sessionStorage.removeItem('folderKbName');
      sessionStorage.removeItem('selectedFolder');
    }

    // Check if any folder is selected
    const anyFolderSelected = newIsChecked.some((checked) => checked);
    onSendData(anyFolderSelected);
  };


  const handleCheckChange = (index) => {
    // setIsChecked(!isChecked);
    handleSelectFolder(index);
  }
  

  useEffect(() => {
    if (selectedPdf) {
      // setSelectedTab(pdfFile?.name)
      handleClickPdf(selectedPdf);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpen = (e, id) => {
    e.stopPropagation();
    setShow(true);
    setFolder_id(id);
  };

  function generateName() {
    const timestamp = new Date().getTime();
    return `src_${timestamp}`;
  }

  const uploadPDFByFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", inputValue);
    formData.append("kb_name", generateName());
    setIsLoading(true);
    chatPDF.uploadPDFByFile(formData, async (response) => {
      // Make the callback function async
      if (response.status === "success") {
        setSourceId(response.data.kb_name);
        formData.delete("file");
        formData.append("File", inputValue);
        formData.delete("kb_name");
        if (response.data.kb_name) {
          await handleFile(response?.data?.kb_name);

          setIsLoading(false);
        } else {
          toast.error("Cannot read the PDF");
          setIsLoading(false);
        }
      } else {
        toast.error("Failed to upload pdf");
        setIsLoading(false);
      }
    });
  };

  const handleFile = async (sourceId) => {
    const formData = new FormData();
    formData.append("folder_id", folder_id);
    formData.append("sourceId", sourceId);
    formData.append("File", inputValue);

    try {
      const response = await allCommonApis(
        `/File/create-file`,
        "post",
        formData
      );
      if (response.status === 200) {
        // Update selectedTab, selectedPdf, and sourceId states
        const url = await generatePresignedUrl(response?.data?.data?.fileUrl);
        setSelectedPdf(url);
        setSelectedTab(response?.data?.data?._id);
        setSourceId(response?.data?.data?.sourceId);

        // Update sessionStorage
        sessionStorage.setItem("selectedTab", response?.data?.data?._id);
        sessionStorage.setItem("selectedPdf", url);
        sessionStorage.setItem("sourceId", response?.data?.data?.sourceId);

        await fetchPDFList();
        handleClose();
        toast.success("File Added Successfully");
      } else {
        // Handle other cases where the status is not SUCCESS
        toast.error("Error Adding File");
        setIsLoading(false);
      }
    } catch (error) {
      // Handle other cases where the status is not SUCCESS
      toast.error("Error adding File");
      setIsLoading(false);
    }
  };

  const handleClickPdf = async (file) => {
    if (draggingFile) return; // Don't process click if dragging
    onSendData(sessionData);
    try {
      const url = await generatePresignedUrl(file.fileUrl);
      setSelectedPdf(url);
      setSelectedTab(file?._id);
      setSourceId(file.sourceId);
      router.push(`/chat/${file.sourceId}`);
      sessionStorage.setItem("selectedTab", file?._id);
      sessionStorage.setItem("selectedPdf", url);
      sessionStorage.setItem("sourceId", file.sourceId);
      sessionStorage.setItem("pdfFile", file.name);
      setIsChecked(false)
      if (!chatMessage.length >= 1) {
        await handleSendMessage(file.sourceId);
      }
    } catch (error) {
      // toast.error("unable to fetch pdf data")
      console.error("Error fetching or uploading PDF file:", error);
    }
  };

  const handleSendMessage = async (sourceId) => {
    const messages = [
      {
        role: "user",
        content: "what questions can I ask in this PDF?",
      },
    ];

    setChatMessage(messages); // Update state
    await sendMessage(messages, sourceId); // Call API
  };

  const handleFileUpload = (file) => {
    setInputValue(file);
  };

  const handleDeleteFile = async (file_id) => {
    try {
      const response = await allCommonApis(
        `/File/delete-File/${file_id}`,
        "delete"
      );
      if (response.status === 200) {
        fetchPDFList();
        toast.success("File deleted Successfully");
      } else {
        // Handle other cases where the status is not SUCCESS
        toast.error("Error deleting File");
        setIsLoading(false);
      }
    } catch {
      // Handle other cases where the status is not SUCCESS
      toast.error("Error deleting File");
      setIsLoading(false);
    }
  };

  const handleDeleteFolder = async (folder) => {
    setIsLoading(true);
    try {
      const folderId = folder.folder._id;
      console.log('Deleting folder:', folder);
      const response = await allCommonApis(
        `/Folder/delete-Folder/${folderId}`,
        "delete"
      );
      if (response.status === 200) {
        fetchPDFList();
        toast.success("Folder deleted successfully");
      } else {
        toast.error("Error deleting folder");
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error("Error deleting folder");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="options">
        {/* Search input */}
        <InputGroup className="mt-3 pe-4 ps-4">
          <Form.Control
            onChange={handleSearchInputChange}
            type="text"
            placeholder="Search for PDFs"
            className="search-input-option rounded-0"
            aria-describedby="search-pdf"
            style={{ borderRight: '0' }}
          />
          <InputGroup.Text id="search-pdf" className="bg-white rounded-0">
            <Image 
              src="/icons/search-pdf.svg"
              width={20}
              height={20}
              alt="Search for PDF"
            />
          </InputGroup.Text>
        </InputGroup>
        <ToastContainer />
        {/* Horizontal line */}
        <hr className="horizontal-line" />

        {/* Folders */}
        <div className="folder-container">
          {folders.length === 0 ? (
            <div className="no-files-found">No PDFs found</div>
          ) : (
            folders.map((folder, index) => (
              <DroppableFolder
                key={index}
                folder={folder.folder}
                onDragOver={handleDragOverFolder}
                onDragLeave={handleDragLeaveFolder}
              >
                <div  key={index} className="folder">
                  {/* Folder icon, name, and delete button */}
                  <div className={`folder-info ${isChecked[index] ? 'active' : ''}`} onClick={() => handleClick(index)} >
                  <Form.Check
                    type='checkbox'
                    checked={isChecked[index]}
                    onChange={() => handleCheckChange(index)}
                  />
                    <div className="folder-icon" onClick={() => handleSelectFolder(index)}>
                      <Image
                        width={20}
                        height={20}
                        className="folder-icon-small"
                        src="/icons/folder-icon-small.svg"
                        alt="Folder Icon"
                      />
                      <div>
                        <span className="folder-name">{folder?.folder?.name}</span>
                      </div>
                    </div>
                    <div className="folder-right">
                      <Image
                          width={8}
                          height={8}
                          onClick={(e) => {
                            handleOpen(e, folder.folder._id);
                          }}
                          className="add-icon-small mx-2"
                          src="/icons/fi-rr-add.svg"
                          alt="Add Icon"
                      />
                      <span>|</span>
                      {/* <Image
                        width={8}
                        height={8}
                        onClick={(e) => {
                          handleOpen(e, folder.folder._id);
                        }}
                        className="add-icon-small mx-2"
                        src="/icons/chat_1.svg"
                        alt="Add Icon"
                      /> */}
                        {!isChecked[index] && folder.folder.name !== "Default" ? (
                          <Image
                            width={20}
                            height={20}
                            className='icons'
                            src="/icons/delete1.svg"
                            alt="Delete Folder"
                            onClick={() => handleDeleteFolder(folder)}
                          />
                        ): (
                          <div style={{ width: '20px', height: '20px' }}></div>
                          )
                        }
                      <span>|</span>
                        <Image 
                          src='/icons/dropdown-arrow.svg'
                          width={8}
                          height={8}
                          alt="Expand"
                          className="add-icon-small mx-2"
                          onClick={() => toggleFolder(index)}
                       />                     
                    </div>
                  </div>

                  {/* Files */}
                  {(folder.isOpen || dragOverFolderId === folder.folder._id) && (
                    <div className="files-container">
                      {folder.files.length === 0 ? (
                        <div className="empty-folder-message">Folder is empty</div>
                      ) : (
                        folder.files.map((file, idx) => (
                          <DraggableFile key={file._id} file={file} onFileClick={handleClickPdf}>
                          <div
                            key={idx}
                            style={{
                              background: selectedTab == file._id ? "#CFA935" : "#F3F4F6",
                            }}
                            className="file file-color-golden"
                          >
                            <div className="file_name_container">
                              <Image
                                width={16}
                                height={16}
                                className="file-small-img"
                                src={
                                  selectedTab == file._id
                                    ? "/icons/file-small.svg"
                                    : "/icons/file-small-gray.svg"
                                }
                                alt="File Icon"
                              />
                              <span
                                className="file-name"
                                style={{
                                  color: selectedTab == file._id ? "#FFFFFF" : "#000000",
                                }}
                              >
                                {file.name}
                              </span>
                            </div>
                            <Image width={20} height={20}
                              className={`icons ${selectedTab == file._id ? 'd-none' : ''}`}
                              src='/icons/delete1.svg'
                              alt='Delete File'
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent event bubbling to the folder toggle
                                handleDeleteFile(file._id);
                              }}
                            />
                          </div>
                        </DraggableFile>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </DroppableFolder>
            ))
          )}
        </div>

        <Modal
          onHide={handleClose}
          className="loader-modal text-center"
          show={show}
          centered
        >
          <Modal.Body className="p-5">
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <form onSubmit={uploadPDFByFile}>
                <div className="form-group">
                  {/* Replace text input with file input */}
                  <input
                    type="file"
                    className="form-control"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(e.target.files[0])} // Call handleFileUpload with the selected file
                    required
                  />
                </div>
                <button type="submit" className="btn btn-success m-2">
                  Upload
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleClose}
                >
                  Cancel
                </button>
              </form>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </DndContext>
  );
};

const DraggableFile = ({ file, children, onFileClick  }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: file._id,
    data: { file },
  });

  const style = transform
    ? {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }
    : undefined;

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <div {...attributes} {...listeners} className="drag-handle">
        {/* Add a drag handle icon here */}
        <Image
          width={20}
          height={20}
          src="/icons/drag-handle.svg"
          alt="Drag Handle"
        />
      </div>
      <div style={{ width: '90%' }} onClick={() => onFileClick(file)}>
        {children}
      </div>
      </div>
    </div>
  );
};

export default OptionSection;

const DroppableFolder = ({ folder, children, onDragOver, onDragLeave }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: folder._id,
    data: { folder },
  });

  useEffect(() => {
    if (isOver) {
      onDragOver(folder._id);
    } else {
      onDragLeave();
    }
  }, [isOver, folder._id, onDragOver, onDragLeave]);

  return <div ref={setNodeRef}>{children}</div>;
};

