const utils = require('./utils')

class Game {
    /**
     * @name tictactoe
     * @kind constructor
     * @param {Object} options options
     * @param {any} [options.message] parameter used for message event
     * @param {any} [options.player_two] second player in the game.
     * @description Easy and simple tic tac toe game!
     */
    constructor(options) {
        if(!options.message) throw new TypeError("message is a required argument")
        if(!options.player_two) throw new TypeError("Second player is a required option")
        this.player_two = options.player_two;
        this.message = options.message;
        this.grid = ['🇦','🇧','🇨','🇩','🇪','🇫','🇬','🇭','🇮']
        this.ttt_grid()
        this.reactions = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮']
        this.players_go = 0
        this.send_message = true
        this.playing_game = true
        this.ttt_message = false
        this.run();
    }

    async run() {
        await this.eval_win()
        if (this.playing_game == true) {
            if (this.players_go % 2  == 0) {
                if (this.send_message == true) {
                    let grid = await this.ttt_grid()
                    if (this.players_go == 0) {
                        this.ttt_message =  await this.message.channel.send('<@' + this.message.author.id + '> it is your turn\n\n' + grid + '\n\n' +this.message.author.username +': :x:\n' + this.player_two.user.username + ': :o:')
                        for (let i in this.reactions) {
                            this.ttt_message.react(this.reactions[i])
                        }
                    }
                    else {
                        this.ttt_message.edit('<@' + this.message.author.id + '> it is your turn\n\n' + grid + '\n\n' + this.message.author.username +': :x:\n' + this.player_two.user.username + ': :o:')
                    }
                }
                this.ttt_message.awaitReactions((reaction, user) => user.id == this.message.author.id && (reaction.emoji.name == '🇦' || reaction.emoji.name == '🇧' || reaction.emoji.name == '🇨' || reaction.emoji.name == '🇩' || reaction.emoji.name == '🇪' || reaction.emoji.name == '🇫' || reaction.emoji.name == '🇬' || reaction.emoji.name == '🇭' || reaction.emoji.name == '🇮'),
                { max: 1, time: 3000000 }).then(async collected => {
                    this.reaction = collected.first().emoji.name
                    if (this.reaction == '🇦') this.user_input = 0
                    if (this.reaction == '🇧') this.user_input = 1
                    if (this.reaction == '🇨') this.user_input = 2
                    if (this.reaction == '🇩') this.user_input = 3
                    if (this.reaction == '🇪') this.user_input = 4
                    if (this.reaction == '🇫') this.user_input = 5
                    if (this.reaction == '🇬') this.user_input = 6
                    if (this.reaction == '🇭') this.user_input = 7
                    if (this.reaction == '🇮') this.user_input = 8
                    this.grid[this.user_input] = ':x:'
                    const userReactions = this.ttt_message.reactions.cache.filter(reaction => reaction.users.cache.has(this.message.author.id));
                    for (const reaction of userReactions.values()) {
                    await reaction.users.remove(this.message.author.id);
                    this.ttt_message.reactions.cache.get(this.reactions[this.user_input]).remove()
                    this.players_go++
                    this.send_message = true
                    this.run()
                }
                }
                ).catch(() => {
                    this.ttt_message.edit('The game has timed out')
                    this.end_game(this.player_two, this.message)
                })
            }
            if (this.players_go % 2  == 1) {
                if (this.send_message == true) {
                    let grid = await this.ttt_grid()
                    this.ttt_message.edit('<@' + this.player_two.id + '> it is your turn\n\n' + grid + '\n\n' + this.message.author.username +': :x:\n' + this.player_two.user.username + ': :o:')
                    this.ttt_message.awaitReactions((reaction, user) => user.id == this.player_two.id && (reaction.emoji.name == '🇦' || reaction.emoji.name == '🇧' || reaction.emoji.name == '🇨' || reaction.emoji.name == '🇩' || reaction.emoji.name == '🇪' || reaction.emoji.name == '🇫' || reaction.emoji.name == '🇬' || reaction.emoji.name == '🇭' || reaction.emoji.name == '🇮'),
                    { max: 1, time: 30000 }).then(async collected => {
                        this.reaction = collected.first().emoji.name
                        if (this.reaction == '🇦') this.user_input = 0
                        if (this.reaction == '🇧') this.user_input = 1
                        if (this.reaction == '🇨') this.user_input = 2
                        if (this.reaction == '🇩') this.user_input = 3
                        if (this.reaction == '🇪') this.user_input = 4
                        if (this.reaction == '🇫') this.user_input = 5
                        if (this.reaction == '🇬') this.user_input = 6
                        if (this.reaction == '🇭') this.user_input = 7
                        if (this.reaction == '🇮') this.user_input = 8
                        this.grid[this.user_input] = ':o:'
                        const userReactions = this.ttt_message.reactions.cache.filter(reaction => reaction.users.cache.has(this.player_two.id));
                        for (const reaction of userReactions.values()) {
                        await reaction.users.remove(this.player_two.id);
                        this.ttt_message.reactions.cache.get(this.reactions[this.user_input]).remove()
                        this.players_go++
                        this.send_message = true
                        this.run()
                    }
                    }
                    ).catch(() => {
                        this.ttt_message.edit('The game has timed out')
                        this.end_game(this.player_two, this.message)
                    })
                }
                }
        }
    }
    async ttt_grid() {
            return `${this.grid[0]} ${this.grid[1]} ${this.grid[2]}\n${this.grid[3]} ${this.grid[4]} ${this.grid[5]}\n${this.grid[6]} ${this.grid[7]} ${this.grid[8]}`
    }
    async eval_win() {
        const win_combinations = [
            [0, 1, 2],
            [3, 4, 5], 
            [6, 7, 8], 
            [0, 3, 6], 
            [1, 4, 7], 
            [2, 5, 8], 
            [0, 4, 8], 
            [2, 4, 6] 
        ]
        let step_one = -1
        while (step_one < 7) {
            step_one++
            if (this.grid[win_combinations[step_one][0]] == ':x:' && this.grid[win_combinations[step_one][1]] == ':x:' && this.grid[win_combinations[step_one][2]] == ':x:') {
                let grid = await this.ttt_grid()
                this.ttt_message.edit('<@' + this.message.author.id + '> Won!\n' + grid)
                this.end_game(this.player_two, this.message)
            }
            if (this.grid[win_combinations[step_one][0]] == ':o:' && this.grid[win_combinations[step_one][1]] == ':o:' && this.grid[win_combinations[step_one][2]] == ':o:') {
                let grid = await this.ttt_grid()
                this.ttt_message.edit('<@' + this.player_two.id + '> Won!\n' + grid)
                this.end_game(this.player_two, this.message)
            }
            if (this.players_go == 9 && step_one == 7) {
                let grid = await this.ttt_grid()
                this.ttt_message.edit('You drew!\n' + grid)
                this.end_game(this.player_two, this.message)
            }
        }
    }
    end_game(player_two, message) {
        utils.inGame = utils.inGame.filter(i => i != message.author.id);
        utils.inGame = utils.inGame.filter(i => i != player_two.id);
        this.playing_game = false
        this.ttt_message.reactions.removeAll()
        return;
    }
}

module.exports = Game;
