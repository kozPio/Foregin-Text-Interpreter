
import ReactHtmlParser from 'react-html-parser';

interface ModalProps {
  modalContent: string;
}




const Modal:React.FC<ModalProps> = ({modalContent}) => {

  return  (
  <div className="modal" id="modal">
    {console.log(modalContent)}
    <div className="headerModal">
      <button data-close-button className="closeModal">&times;</button>
    </div>
    <div className="bodyModal">
      Hello
      {ReactHtmlParser(modalContent)}
    </div>
    <div id="overlay"></div>
  </div>
  )
}


export default Modal;