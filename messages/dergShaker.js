module.exports = {
    content: 'derg shaker',
    async execute(message) {
        if (!message.cleanContent.includes('roboval')) return;

        const replies = [
            'WOOOOOOO!!!!!!\n\n<a:evalHyperWiggle:921880944707776542><a:evalHyperWiggle:921880944707776542><a:evalHyperWiggle:921880944707776542><a:evalHyperWiggle:921880944707776542><a:evalHyperWiggle:921880944707776542><a:evalHyperWiggle:921880944707776542><a:evalHyperWiggle:921880944707776542><a:evalHyperWiggle:921880944707776542><a:evalHyperWiggle:921880944707776542>',
            'YEAH BABY THIS SHIT IS FOR DENNY <:evalButt:1019368597119848548><a:evalHyperWiggle:921880944707776542><:evalButt:1019368597119848548><a:evalHyperWiggle:921880944707776542><:evalButt:1019368597119848548><a:evalHyperWiggle:921880944707776542>',
            'Nah fuck you.',
            'UwU okay~\n\n*wiggles my butt*',
            'https://cdn.discordapp.com/attachments/856279852923355148/1020937830521917540/big_one.gif',
        ];

        await message.channel.send(replies[Math.floor(Math.random() * replies.length)]);
    },
};