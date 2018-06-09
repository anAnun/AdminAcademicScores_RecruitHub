using Amazon;
using Amazon.S3;
using Amazon.S3.Transfer;
using Sabio.Data.Providers;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using System.Text;
using System.Threading.Tasks;
using UploadModel.Models;

namespace Sabio.Services
{
    public class AmazonUploader : IAmazonUploader
    {
        readonly IDataProvider dataProvider;
        readonly IConfiguration confg;

        public AmazonUploader(IDataProvider dataProvider, IConfiguration confg)
        {
            this.dataProvider = dataProvider;
            this.confg = confg;
        }

       
            public string Upload(int userId, string contentType, byte[] data)
            {
                var stream = new System.IO.MemoryStream(data);           
                string bucketName = "sabio-training/C54";
                string fileName = Guid.NewGuid().ToString("N");
                var accessKey = confg.AmazonAccessKey;
                var secretKey = confg.AmazonSecretKey;

                IAmazonS3 client = new AmazonS3Client(accessKey, secretKey, RegionEndpoint.USWest2);
                TransferUtility utility = new TransferUtility(client);
                TransferUtilityUploadRequest request = new TransferUtilityUploadRequest();

                request.BucketName = bucketName;
                request.Key = fileName;
                request.InputStream = stream;
                request.ContentType = contentType;
                
            
                utility.Upload(request);

                var urlOfImage = "https://sabio-training.s3-us-west-2.amazonaws.com/C54/" + fileName;

                dataProvider.ExecuteNonQuery(
                    "UploadsProc",
                    inputParamMapper: (parameters) =>
                    {
                        parameters.AddWithValue("@UserId", userId);
                        parameters.AddWithValue("@URL", urlOfImage);
                    });

                return urlOfImage;
            }
    }
}
