
import { useRef, useState } from 'react';
import ReactHtmlParser from 'react-html-parser';
import styled from 'styled-components';


interface ModalProps {
  modalContent: string;
  show: boolean;
  toggleModal: any;
}

const BackGround = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0,0,0, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;`

  const ModalWrapper = styled.div`
  width: 800px;
  height: 500px;
  box-shadow: 0 5px 16px rgba(0,0,0, 0.2);
  background: #fff;
  color: #000;
  position: relative;
  display: grid;
  grid-template-column: 1f 1f;
  z-index: 10;
  border-radius: 10px;
   `

   const ModalImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 10px 0 0 10px;
  background: #000;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: #141414;
  p {
    margin-bottom: 1rem;
  }
  button {
    padding: 10px 24px;
    background: #141414;
    color: #fff;
    border: none;
  }
`;


const CloseModalX = styled.div`
`

const CloseModalButton = styled(CloseModalX)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
`;




const Modal:React.FC<ModalProps> = ({modalContent, show, toggleModal}) => {

  const [showModal, setShowModal]= useState<boolean>(show);
  const modalRef = useRef();

  const CloseModal = () => {
    toggleModal(!showModal)
  }

  const CloseModalOnOutsideClick = (e: React.MouseEvent) => {
    if(modalRef.current === e.target){
      toggleModal(!showModal);
    }
  }

  return  (
    <BackGround ref={modalRef as any} onClick={CloseModalOnOutsideClick}>
      <ModalWrapper>
        <ModalContent>
          {ReactHtmlParser(modalContent)}
        </ModalContent>
        <CloseModalButton aria-label='Close modal' onClick={()=> CloseModal()}/>
      </ModalWrapper>
    </BackGround>
  
  )
}


export default Modal;



{/* <div className="modal active" id="modal">
    {console.log(modalContent)}
    <div className="headerModal">
      <button data-close-button className="closeModal">&times;</button>
    </div>
    <div className="bodyModal">
      Hello
      
    </div>
    <div id="overlay active"></div>
  </div> */}

 