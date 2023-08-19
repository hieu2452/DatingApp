using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessagesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IMessageRepoitory _messageRepoitory;
        public MessagesController(IUserRepository userRepository, IMessageRepoitory messageRepoitory, IMapper mapper)
        {
            _messageRepoitory = messageRepoitory;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto)
        {
            var username = User.GetUsername();

            if (username == createMessageDto.RecipientUsername)
                return BadRequest("You cant message yourself");

            var sender = await _userRepository.GetUserByUsernameAsync(username);

            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null) return NotFound();

            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };
            _messageRepoitory.AddMessage(message);

            if (await _messageRepoitory.SaveAllAsync()) return Ok(_mapper.Map<MessageDto>(message));

            return BadRequest("falied to send message");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUsername();
            var messages = await _messageRepoitory.GetMessagesForUser(messageParams);
            Response.AddPaginationHeader(
                new PaginationHeader(messages.CurrentPage, messageParams.PageSize, messages.TotalCount, messages.TotalPages));

            return Ok(messages);
        }

        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username)
        {
            var currentUsername = User.GetUsername();

            return Ok(await _messageRepoitory.GetMessageThread(currentUsername, username));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletedMessage(int id)
        {
            var username = User.GetUsername();

            var message = await _messageRepoitory.GetMessages(id);

            if (message.SenderUsername != username && message.RecipientUsername != username)
                return Unauthorized();

            if (message.SenderUsername == username) message.SenderDeleted = true;
            if (message.RecipientUsername == username) message.RecipentDeleted = true;

            if (message.SenderDeleted && message.RecipentDeleted)
            {
                _messageRepoitory.DeleteMessage(message);
            }

            if(await _messageRepoitory.SaveAllAsync()) return Ok();

            return BadRequest("Unable to delete the message");
        }
    }
}