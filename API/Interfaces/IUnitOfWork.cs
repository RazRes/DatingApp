using System;

namespace API.Interfaces;

public interface IUnitOfWork
{
    IMemberRepository memberRepository { get; }
    IMessageRepository messageRepository { get; }
    ILikesRepository likesRepository { get; }
    Task<Boolean> Complete();
    bool HasChanges();
}
