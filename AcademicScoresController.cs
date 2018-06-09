using Sabio.Models.Domain;
using Sabio.Models.Responses;
using Sabio.Services;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sabio.Web.Controllers
{
    public class AcademicScoresController : ApiController
    {
        readonly IAcademicScoresService academicScoresService;

        public AcademicScoresController(IAcademicScoresService academicScoresService)
        {
            this.academicScoresService = academicScoresService;
        }
        [Route("api/academicscores"), HttpGet]
        public HttpResponseMessage GetAll()
        {
            List<AcademicScores> academicScores = academicScoresService.GetAll();
            ItemsResponse<AcademicScores> itemsResponse = new ItemsResponse<AcademicScores>();
            itemsResponse.Items = academicScores;

            return Request.CreateResponse(HttpStatusCode.OK, itemsResponse);
        }

        [Route("api/academicscores"), HttpPost]
        public HttpResponseMessage Create(AcademicScoresCreateRequest req)
        {
            if (req == null)
            {
                ModelState.AddModelError("", "You did not add any body data!");
            }

            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            ItemResponse<int> itemResponse = new ItemResponse<int>();
            itemResponse.Item = academicScoresService.Create(req);

            return Request.CreateResponse(HttpStatusCode.Created, itemResponse);
        }

        [Route("api/academicscores/{id:int}"), HttpGet()]
        public HttpResponseMessage GetById(int id)
        {
            AcademicScores academicScores = academicScoresService.GetById(id);
            ItemResponse<AcademicScores> itemResponse = new ItemResponse<AcademicScores>();
            itemResponse.Item = academicScores;

            return Request.CreateResponse(HttpStatusCode.OK, itemResponse);
        }

        [Route("api/academicscores/{id:int}"), HttpPut]
        public HttpResponseMessage Update(int id, AcademicScoresUpdateRequest req)
        {
            
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            if (req == null)
            {
                ModelState.AddModelError("", "You did not add any body data!");
            }

            academicScoresService.Update(req);

            return Request.CreateResponse(HttpStatusCode.OK, new SuccessResponse());
        }

        [Route("api/academicscores/{id:int}"), HttpDelete]
        public HttpResponseMessage Delete(int id)
        {
            academicScoresService.Delete(id);

            return Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
