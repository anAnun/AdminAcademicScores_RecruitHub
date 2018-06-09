using Sabio.Models.Responses;
using Sabio.Services;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using UploadModel.Models;
using Sabio.Services.Security;
using Sabio.Services.Interfaces;

namespace Sabio.Web.Controllers
{
    public class UploadsController : ApiController
    {
        readonly IAmazonUploader amazonUploader;
        public UploadsController(IAmazonUploader amazonUploader)
        {
            this.amazonUploader = amazonUploader;
        }

        [Route("api/academicscores/uploadfile"), HttpPost]
        public async Task<HttpResponseMessage> Upload()
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                return new HttpResponseMessage(HttpStatusCode.BadRequest);
            }
            var filesReadToProvider = await Request.Content.ReadAsMultipartAsync();
            List<string> urls = new List<string>();
       
            int userId = User.Identity.GetId().Value;
            foreach (var stream in filesReadToProvider.Contents)
            {
                var fileBytes = await stream.ReadAsByteArrayAsync();
                var contentType = stream.Headers.ContentType.MediaType;
                var url = amazonUploader.Upload(userId, contentType, fileBytes);
                urls.Add(url);
            }
            
            ItemsResponse<string> itemsResponse = new ItemsResponse<string>();
            itemsResponse.Items = urls;
            return Request.CreateResponse(HttpStatusCode.Created, value: itemsResponse);
        }
    } 
}
