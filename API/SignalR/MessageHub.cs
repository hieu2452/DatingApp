using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class MessageHub : Hub
    {
        private readonly IMessageRepoitory _messageRepoitory;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        public MessageHub(IMessageRepoitory messageRepoitory, IUserRepository userRepository, IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _messageRepoitory = messageRepoitory;

        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();

            var otherUser = httpContext.Request.Query["user"];

            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await AddToGroup(groupName);

            var messages = await _messageRepoitory.GetMessageThread(Context.User.GetUsername(), otherUser);

            await Clients.Groups(groupName).SendAsync("ReceiveMessageThread", messages);

        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await RemoveFromMessageGroup();
            await base.OnDisconnectedAsync(exception);
        }

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;

            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }


        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var username = Context.User.GetUsername();

            if (username == createMessageDto.RecipientUsername)
                throw new HubException("Cant send message to yourself");

            var sender = await _userRepository.GetUserByUsernameAsync(username);

            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);

            if (recipient == null) throw new HubException("No user found"); ;

            var message = new Message
            {
                SenderId = sender.Id,
                RecipientId = recipient.Id,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            var groupName = GetGroupName(sender.UserName, recipient.UserName);

            var group = await _messageRepoitory.GetMessageGroup(groupName);

            if (group.Connections.Any(x => x.Username == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow.CurrentDateTime();
            }

            _messageRepoitory.AddMessage(message);

            if (await _messageRepoitory.SaveAllAsync())
            {
                await Clients.Group(groupName).SendAsync("newMessage", _mapper.Map<MessageDto>(message));
            }

        }

        private async Task<bool> AddToGroup(string groupName)
        {
            var group = await _messageRepoitory.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());

            if (group == null)
            {
                group = new Group(groupName);
                _messageRepoitory.AddGroup(group);
            }

            group.Connections.Add(connection);

            return await _messageRepoitory.SaveAllAsync();
        }

        private async Task RemoveFromMessageGroup()
        {
            var connection = await _messageRepoitory.GetConnection(Context.ConnectionId);
            _messageRepoitory.RemoveConnection(connection);
            await _messageRepoitory.SaveAllAsync();
        }
    }
}