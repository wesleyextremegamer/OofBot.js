class QueueManager {
    constructor() {
        this.queue_cooldowns = new Map();
        this.queue_running = new Map(); // Aqui guardaremos { active: boolean, tasks: Array }
    }

    getContext(interaction, scope, commandName)
    {
        switch(scope)
        {
            case 'user':
            {
                return `${commandName}_${interaction.user.id}`;
            }
            case 'guild':
            {
                return `${commandName}_${interaction.guild?.id}`;
            }
            case 'guild_user':
            {
                return `${commandName}_${interaction.guild?.id}_${interaction.user.id}`;
            }
            case 'global':
            {
                return `${commandName}_global`;
            }
        }
    }

    checkCooldown(interaction, command) {
        if (!command.rateLimit) return false; // Não está em cooldown

        const context = this.getContext(interaction, command.rateLimit.scope, command.data.name);
        const now = Date.now();
        const expiration = this.queue_cooldowns.get(context);

        if (expiration && now < expiration) {
            return true; // Está em cooldown
        }
        return false;
    }

    async run(interaction, command) {
        const { rateLimit } = command;
        const context = this.getContext(interaction, rateLimit?.scope, command.data.name);

        // 1. Verificação de Cooldown (Bloqueio imediato)
        if (this.checkCooldown(interaction, command)) {
            return await interaction.reply({ 
                content: 'Ei, vá com calma! Ainda estou processando.', 
                flags: [MessageFlags.Ephemeral] 
            });
        }

        // 2. Lógica de Fila (Se o comando tiver max_queue)
        if (rateLimit?.max_queue) {
            if (!this.queue_running.has(context)) {
                this.queue_running.set(context, { active: false, tasks: [] });
            }

            const queue = this.queue_running.get(context);

            // Verifica se a fila está cheia
            if (queue.tasks.length >= rateLimit.max_queue) {
                return await interaction.reply({ 
                    content: 'A fila para este comando está cheia!', 
                    flags: [MessageFlags.Ephemeral] 
                });
            }

            // Adiciona a execução na fila
            return new Promise((resolve) => {
                queue.tasks.push(async () => {
                    // Define o Cooldown assim que o comando começa a rodar
                    if (rateLimit.time) {
                        this.queue_cooldowns.set(context, Date.now() + rateLimit.time);
                    }
                    
                    try {
                        await command.execute(interaction);
                    } finally {
                        resolve();
                        this.next(context); // Chama o próximo da fila
                    }
                });

                if (!queue.active) {
                    this.next(context);
                }
            });
        } else {
            // Se não tiver fila, apenas executa e define o cooldown
            if (rateLimit?.time) {
                this.queue_cooldowns.set(context, Date.now() + rateLimit.time);
            }
            return await command.execute(interaction);
        }
    }

    async next(context) {
        const queue = this.queue_running.get(context);
        if (!queue || queue.tasks.length === 0) {
            if (queue) queue.active = false;
            return;
        }

        queue.active = true;
        const task = queue.tasks.shift(); // Pega o primeiro da fila (FIFO)
        await task();
    }
}

module.exports = QueueManager