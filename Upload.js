import React from 'react';
import * as axios from 'axios';

class Upload extends React.Component {

    uploadToPc (selectorFiles) {
        {
            console.log(selectorFiles);
            var bodyFormData = new FormData();
            bodyFormData.append("image", selectorFiles[0]);
            axios.post('http://localhost:3024/api/academicscores/uploadfile', bodyFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
           
        }
    }
    render() {
        return (
            <div>
                <h1>
                    File Upload
                </h1>
                <form onSubmit={this.uploadToPc}>
                    <input 
                        type="file"
                        onChange={ (e) =>
                            this.uploadToPc(e.target.files) }
                    />
                </form>
            </div>
        )
    }
}

export default Upload;
