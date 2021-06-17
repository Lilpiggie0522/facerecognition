import React from 'react';
import './imageLinkForm.css'
const ImageLinkForm = () =>{
    return(
        <div>
            <p className='f3'>
                {'此网站具有可以识别你是哪只肥猪的魔力'}
            </p>
            <div className='center'>
                <div className='center form pa4 br3 shadow-5'>
                    <input className='f4 pa2 w-70 center' type='tex' />
                    <button className='w-40 grow f4 link ph3 pv2 dib white bg-light-purple'>识别肥猪</button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;