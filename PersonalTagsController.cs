using Sabio.Models.Requests;
using Sabio.Models.Responses;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Services.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Sabio.Web.Controllers.Api
{
    public class PersonalTagsController : ApiController
    {
        readonly IPersonalTagsService personalTagsService;

        public PersonalTagsController(IPersonalTagsService personalTagsService)
        {
            this.personalTagsService = personalTagsService;
        }
        [Route("api/favorites"), HttpGet]
        public HttpResponseMessage GetAllForUser()
        {
            int userId = User.Identity.GetId().Value;
            List<PersonalTag> personalTags = personalTagsService.GetAllForUser(userId);
            ItemsResponse<PersonalTag> itemsResponse = new ItemsResponse<PersonalTag>();
            itemsResponse.Items = personalTags;

            return Request.CreateResponse(HttpStatusCode.OK, itemsResponse);
            
        }

        [Route("api/favorites/post"), HttpPost]
        public HttpResponseMessage Create(SetTagsRequest req)
        {
            
            if (req == null)
            {
                ModelState.AddModelError("", "You did not add any body data!");
            }


            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            int userId = User.Identity.GetId().Value;
            
            req.UserId = userId;


            ItemResponse<int> itemResponse = new ItemResponse<int>();
            itemResponse.Item = personalTagsService.Create(req);

            return Request.CreateResponse(HttpStatusCode.Created, itemResponse);
        }

        [Route("api/favorites/getfortarget"), HttpGet()]
        public HttpResponseMessage GetTagsForTarget(int targetId, int targetType)
        {
            int userId = User.Identity.GetId().Value;
            List<PersonalTag> personalTag = personalTagsService.GetTagsForTarget(userId, targetId, targetType);
            ItemsResponse<PersonalTag> itemsResponse = new ItemsResponse<PersonalTag>();
            itemsResponse.Items = personalTag;

            return Request.CreateResponse(HttpStatusCode.OK, itemsResponse);
        }

        [Route("api/favorites"), HttpPut]
        public HttpResponseMessage Update(SetTagsRequest req)
        {
            int userId = User.Identity.GetId().Value;
            req.UserId = userId;
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
            if (req == null)
            {
                ModelState.AddModelError("", "You did not add any body data!");
            }


            personalTagsService.Update(req);

            return Request.CreateResponse(HttpStatusCode.OK, new SuccessResponse());
        }
        
        
    }
}
