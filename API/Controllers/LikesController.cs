using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly IUnitOfWork _uow;
        public LikesController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var LikedUsers = await _uow.UserRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _uow.LikeRepository.GetUserWithLikes(sourceUserId);

            if (LikedUsers == null) return NotFound();

            if (sourceUser.UserName == username) return BadRequest("cant like yourself");

            var userLike = await _uow.LikeRepository.GetUserLike(sourceUserId, LikedUsers.Id);

            if (userLike != null) return BadRequest("You already liked this user");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                SourceUser = sourceUser,
                TargetUser = LikedUsers,
                TargetUserId = LikedUsers.Id
            };
            _uow.LikeRepository.AddLike(userLike);
            // sourceUser.LikedUsers.Add(userLike);

            if (await _uow.Complete()) return Ok();

            return BadRequest("Failed to like user");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUsersLike([FromQuery] LikesParam likesParam)
        {
            likesParam.UserId = User.GetUserId();
            var user = await _uow.LikeRepository.GetUserLikes(likesParam);
            Response.AddPaginationHeader(new PaginationHeader(user.CurrentPage, user.TotalPages, user.TotalCount, user.TotalPages));
            return Ok(user);
        }
    }
}