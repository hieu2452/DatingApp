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
        private readonly IUserRepository _userRepository;
        private readonly ILikeRepository _likeRepository;
        public LikesController(IUserRepository userRepository, ILikeRepository likeRepository)
        {
            _likeRepository = likeRepository;
            _userRepository = userRepository;

        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var LikedUsers = await _userRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _likeRepository.GetUserWithLikes(sourceUserId);

            if (LikedUsers == null) return NotFound();

            if (sourceUser.UserName == username) return BadRequest("cant like yourself");

            var userLike = await _likeRepository.GetUserLike(sourceUserId, LikedUsers.Id);

            if (userLike != null) return BadRequest("You already liked this user");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                SourceUser = sourceUser,
                TargetUser = LikedUsers,
                TargetUserId = LikedUsers.Id
            };

            sourceUser.LikedUsers.Add(userLike);

            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to like user");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUsersLike([FromQuery] LikesParam likesParam)
        {
            likesParam.UserId = User.GetUserId();
            var user = await _likeRepository.GetUserLikes(likesParam);
            Response.AddPaginationHeader(new PaginationHeader(likesParam.pageNumber, likesParam.PageSize, user.TotalCount, user.TotalPages));
            return Ok(user);
        }
    }
}