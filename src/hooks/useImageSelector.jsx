import { Icon } from "@iconify/react/dist/iconify.js";
import { useRef, useState } from "react";
import styled from "styled-components";
import { useGlobalStore } from "../store/GlobalStore";
export const ImageSelector = ({ fileUrl }) => {
  const fileInputRef = useRef(null);
  const { setFile, setFileUrl } = useGlobalStore();
  function openFileSelector() {
    fileInputRef.current.click();
  }
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const fileReader = new FileReader();
    fileReader.readAsDataURL(selectedFile);
    setFile(selectedFile);
    fileReader.onload = () => {
      setFileUrl(fileReader.result);
    };
  };
  return (
    <Container>
      <ImageWrapper>
        <Avatar
          src={
            fileUrl !== "-" ? fileUrl : "https://i.ibb.co/39y0kysq/subir.png"
          }
          alt="Selected"
        />
        <EditButton onClick={openFileSelector}>
          <Icon icon="lets-icons:edit-fill" className="icon" />
        </EditButton>
        <HiddenInput
          onChange={(e) => handleImageChange(e)}
          ref={fileInputRef}
          type="file"
        />
      </ImageWrapper>
    </Container>
  );
};
const Container = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;
const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 10px;
  object-fit: cover;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;
const EditButton = styled.button`
  position: absolute;
  left: 60px;
  top: 10px;
  width: 30px;
  height: 30px;
  background-color: #2e2e2e;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s, transform 0.2s;
  .icon {
    font-size: 18px;
    color: white;
  }
  &:hover {
    background-color: #575757;
    transform: scale(1.1);
  }
`;
const HiddenInput = styled.input`
  display: none;
`;
