import './AppView.css';
import React, {useState, useEffect} from "react";
import ReactHtmlParser from 'react-html-parser';
import { fullDictionary } from "../database/translator";
import Modal from './Modal';
import styled from 'styled-components';
import { GlobalStyle } from './global-style';


type CharType = {
  char: string;
  kana: string;
  meaning: string;
  sentence: string;
  sentenceKana: string;
  occur: number;
}

interface ExtendedCharType extends CharType {
  index: number;
  j?: number;
}

interface leftoverWordType {
  index: number;
  char: string;
}

interface ModuleProps {
  [key: string]: string;
}

const theClipboard = navigator.clipboard;



const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const Button = styled.button`
  min-width: 50px;
  padding: 16px 32px;
  border-radius: 4px;
  border: none;
  background: #141414;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
`

const AppView: React.FC = () => {

  const [dictionaryArray, setDictionaryArray] =useState(fullDictionary.split(/\t|\n/));
  const [finalArray, setFinalArray] =useState<CharType[]>([{char: '',
    kana: '',
    meaning: '',
    sentence: '',
    sentenceKana: '',
    occur: 0}]);
  const [textVal, setTextVal]= useState('');
  const colorArray = ['red', 'blue', 'aqua', 'purple', 'pink', 'orange'];
  const [table, setTable] = useState(false);
  const [displayText, setDisplayText]= useState<Array<leftoverWordType | ExtendedCharType>>([{char: '',
  kana: '',
  meaning: '',
  sentence: '',
  sentenceKana: '',
  occur: 0,
  index: 0}]);
  const [openModal, setOpenModal]= useState(false);
  const [modalContent, setModalContent]=useState<ModuleProps>({});
  const [charModal, setCharModal] = useState('');
  const [previousClipboardText, setPreviousClipboardText ]=useState('');
  const [interval, setInter]=useState<NodeJS.Timeout | null>(null)

  useEffect(()=> {
    createDictionary();
  },[])



  const generateClipboardText =()  => {
    if(interval) {
      clearInterval(interval)
      setInter(null);
    }else{
      setInter(setInterval(readClipboard, 2000))
    }
  };

  const  generatePlaceHolder =(num: number) => {
    let placeholder = '';
    for(let i=0; i< num; i++){
      placeholder =placeholder.concat('','_')
    }
    return placeholder
  };


  const toggleModdal = (char?: string) => {
    if(char){
      setCharModal(char);
      //modal.classList.add('active');
      //overlay.classList.add('active');
    }
    setOpenModal(!openModal)
  }


  const  readClipboard =() => {
    theClipboard.readText().then(clipText =>{
      if(clipText === previousClipboardText) {
        return
      }
      console.log('changed')
      setTextVal(clipText);
      generateTranslation(clipText);
      setPreviousClipboardText(clipText);
    })
    
    
  }

  const juggleColors = (word: string, num: number) =>{

    if(word){
      if(num === 5){
        num = 0;
      } else{
        num++;
      }
    }
  
    return num 
  }

  const createDictionary = () => {
    let tempArr = [];
    for (let i=0; i< dictionaryArray.length; i+=7){ 
      let word: CharType = {char: '',
      kana: '',
      meaning: '',
      sentence: '',
      sentenceKana: '',
      occur: 0};
      word.char = dictionaryArray[i];
      word.kana = dictionaryArray[i+1];
      word.meaning = dictionaryArray[i+2];
      word.sentence = dictionaryArray[i+5];
      word.sentenceKana = dictionaryArray[i+6];
      //word.occur = 0;
    
      tempArr.push(word);
    }
    tempArr = tempArr.sort((a: CharType, b: CharType)=> {
      if(a.char && b.char){
        return b.char.length - a.char.length
      }else {
        return 0;
      }
    })
    setFinalArray(tempArr);
  };


  const splitChar = (char: string, num: number) => {
    let arr = [];
    if(num === 3 || num === 4){
      arr.push(char);
      arr.push(char.substring(0, num-1))
    }else {
      arr.push(char)
    }
    
  
    return arr
  }


  
  const generateTranslation = (text?: string) => {
    let textValue = null;
    if(text){
      textValue = text;
    }else{
      textValue = textVal;
    }
    
    
    let charsInText = findTranslations(textValue);

    let sortedChars = charsInText.sort((a, b) => {
      return a.index - b.index});


    return createDescriptions(sortedChars);
  }

  const findTranslations =(text: string) => {
    let outputArray:  Array<leftoverWordType | ExtendedCharType> = []
    let tempText = text;
    let placeholder = '';
    let leftoverWords = [];
    // let index = -1;
    
    
    for(let i = 0; i < finalArray.length; i++) {
      
      let length =finalArray[i].char.length
      let charArr = splitChar(finalArray[i].char ,length);

      if(charArr.length <= 1){
        let index =tempText.indexOf(charArr[0]);
        if(index > -1){
        outputArray.push({...finalArray[i], index})
        placeholder =generatePlaceHolder(length)
        tempText = tempText.replace(charArr[0], placeholder);
        }
      }else {
        let index =tempText.indexOf(charArr[1])
        if(index > -1){
          placeholder =generatePlaceHolder(length-1)
          outputArray.push({...finalArray[i], index, j: 1})
          tempText = tempText.replace(charArr[1], placeholder);
          }
      }
       
    }
    
    for(let n =0; n<tempText.length; n++){
      if(tempText[n] !== '_'){
        leftoverWords.push({index: n, char: tempText[n]})
      }
    }

    let wholeSentence = outputArray.concat(leftoverWords)
    
    
    console.log(tempText)
    return wholeSentence;
    
  }


  const createDescriptions =(arrOfChars: Array<ExtendedCharType | leftoverWordType >) => {
    setTable(true);
    let DescriptionsArray: Array<ExtendedCharType | leftoverWordType >= [];
    let moduleArrray: ModuleProps = {};
    
  
  
    for(let i=0; i <arrOfChars.length; i++){
      
      if('meaning' in arrOfChars[i]){
        let insideOfModule= `
          <div class="bodyModal-div">
              <p class="bodyModal-p">Char: ${(arrOfChars[i] as ExtendedCharType).char}</p>
              <p class="bodyModal-p">Kana: ${(arrOfChars[i] as ExtendedCharType).kana}</p>
              <p class="bodyModal-p">Meaning: ${(arrOfChars[i] as ExtendedCharType).meaning}</p>
              <p class="bodyModal-p">Sentence: ${(arrOfChars[i] as ExtendedCharType).sentence}</p>
              <p class="bodyModal-p">KanaSentence: ${(arrOfChars[i] as ExtendedCharType).sentenceKana}</p>
          </div>
          `
        if((arrOfChars[i] as ExtendedCharType).j){
          DescriptionsArray.push({...arrOfChars[i], char: arrOfChars[i].char.substring(0, arrOfChars[i].char.length-1)})
          moduleArrray[arrOfChars[i].char.substring(0, arrOfChars[i].char.length-1)]=insideOfModule;
        }else{
          DescriptionsArray.push(arrOfChars[i]); 
          
          moduleArrray[arrOfChars[i].char]=insideOfModule;
        }

      }else{
        DescriptionsArray.push(arrOfChars[i])
      }
      
      
     
    }
    setModalContent(moduleArrray);
    setDisplayText(DescriptionsArray);
  }
  return (<Container>
      <div className="dispaly-text">
        {displayText && displayText.map((char)=> (
          <p onClick={()=> toggleModdal(char.char)} key={char.index}>{char.char}</p>
        ))}
      </div>
      <textarea className="text-area"   value={textVal} onChange={(e)=> setTextVal(e.target.value)} />
      <Button onClick={()=>  generateTranslation()}  id="button">Compile</Button>
      <Button onClick={()=> generateClipboardText()} id="generateClipboardText">Start/Stop reading from clipboard</Button>
      <Button onClick={()=> toggleModdal()}>Close Modal</Button>
      {table && <table id="table">
        <thead>
          <tr>
            <th>word</th>
            <th>kana</th>
            <th>meaning</th>
            <th>sentence</th>
            <th>sentence with kana</th>
          </tr>
        </thead>
        <tbody>
          {displayText.map((elem)=> (
            ('meaning' in elem) &&
            <tr key={elem.index}> 
              <td className="table" ><b>{ReactHtmlParser(elem.char)}</b></td>
              <td className="table" >{ReactHtmlParser(elem.kana)}</td>
              <td className="table" >{ReactHtmlParser(elem.meaning)}</td>
              <td className="table" >{ReactHtmlParser(elem.sentence)}</td>
              <td className="table ">{ReactHtmlParser(elem.sentenceKana)}</td>
            </tr>
          ))}
        </tbody>
      </table>}
      <GlobalStyle />
      {openModal && <Modal modalContent={modalContent[charModal]} show={openModal} toggleModal={(modal: boolean)=> setOpenModal(modal)} />} 
    </Container>)
}

export default  AppView;





const alan: string  =  `<b>Hello </b>`


// let insideOfTable= 
// `
//     <td class="table-td" style=" color: ${colorArray[y]}">${arrOfChars[i].char}</td>
//     <td class="table-td" style=" color: ${colorArray[y]}">${arrOfChars[i].kana}</td>
//     <td class="table-td" style=" color: ${colorArray[y]}">${arrOfChars[i].meaning}</td>
//     <td class="table-td" style=" color: ${colorArray[y]}">${arrOfChars[i].sentence}</td>
//     <td class="table-td "style=" color: ${colorArray[y]}">${arrOfChars[i].sentenceKana}</td>
// `
// let insideOfModule= `
// <div class="bodyModal-div">
//     <p class="bodyModal-p">Char: ${arrOfChars[i].char}</p>
//     <p class="bodyModal-p">Kana: ${arrOfChars[i].kana}</p>
//     <p class="bodyModal-p">Meaning: ${arrOfChars[i].meaning}</p>
//     <p class="bodyModal-p">Sentence: ${arrOfChars[i].sentence}</p>
//     <p class="bodyModal-p">KanaSentence: ${arrOfChars[i].sentenceKana}</p>
// </div>
// `
// div.addEventListener('click', ()=> {
//   openModal(modal, insideOfModule)
// })

// if (moduleArray.some(e => e.association === arrOfChars[i].char)) {
//   null
// }else {
//   moduleArray.push({inside: insideOfTable, association: arrOfChars[i].char })
// }
// }

// updatedSentence.appendChild(div);

// }

// document.getElementById('displayText').innerHTML = '';
// document.getElementById('displayText').appendChild(updatedSentence);
// document.querySelector('#table').innerHTML = '';
// let tr2 = document.createElement('tr');
// tr2.innerHTML =  insideTableHead;
// document.querySelector('#table').appendChild(tr2);
// for(let i = 0; i<moduleArray.length; i++){
// let tr = document.createElement('tr');
// tr.innerHTML= moduleArray[i].inside; 
// document.querySelector('#table').appendChild(tr); 
// }
















                // let previousClipboardText = '';


                // function readClipboard() {
                //   theClipboard.readText().then(clipText =>{
                //     if(clipText === previousClipboardText) {
                //       return
                //     }
                //     console.log('changed')
                //     document.querySelector('#text').innerHTML = clipText;
                //     generateTranslation(clipText);
                //     previousClipboardText = clipText;
                //   })
                  
                  
  