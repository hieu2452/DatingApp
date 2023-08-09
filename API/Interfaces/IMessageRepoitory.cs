using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IMessageRepoitory
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message> GetMessages(int id);
        Task<PagedList<MessageDto>> GetMessagesForUser();
        Task<IEnumerable<MessageDto>> GetMessageThread(int currentUserId, int recepientUserId);
        Task<bool> SaveAllAsync();
    }
}