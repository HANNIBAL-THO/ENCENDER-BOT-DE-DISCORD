const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

client.on('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    
    if (message.mentions.has(client.user)) {
        const embed = new EmbedBuilder()
            .setColor(config.embedColors.primary)
            .setAuthor({ 
                name: '⚡ THO Bot - Sistema de Ayuda', 
                iconURL: client.user.displayAvatarURL() 
            })
            .setDescription(`Hey ${message.author}, usa \`${config.prefix}ayuda\` para ver mis comandos`)
            .setImage(config.bannerGif) 
            .setFooter({ 
                text: '💫 THO Bot | Powered by Community', 
                iconURL: client.user.displayAvatarURL() 
            })
            .setTimestamp();
        await message.reply({ embeds: [embed] });
    }

    if (message.content.startsWith(config.prefix)) {
        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        switch(command) {
            case 'info': {
                const guild = message.guild;
                const owner = await guild.fetchOwner();
                const createdAt = Math.floor(guild.createdTimestamp / 1000);

                const infoEmbed = new EmbedBuilder()
                    .setColor(config.embedColors.primary)
                    .setAuthor({ 
                        name: `📊 ${guild.name} | Información`, 
                        iconURL: guild.iconURL({ dynamic: true }) 
                    })
                    .setThumbnail(guild.iconURL({ dynamic: true, size: 4096 }))
                    .addFields([
                        { 
                            name: '👑 PROPIETARIO',
                            value: `> ${owner.user.tag}\n> ID: ${owner.user.id}`,
                            inline: true
                        },
                        { 
                            name: '👥 MIEMBROS',
                            value: `> Total: ${guild.memberCount}\n> Bots: ${guild.members.cache.filter(m => m.user.bot).size}`,
                            inline: true
                        },
                        { 
                            name: '🌟 BOOST',
                            value: `> Nivel: ${guild.premiumTier}\n> Cantidad: ${guild.premiumSubscriptionCount}`,
                            inline: true
                        },
                        { 
                            name: '📅 CREACIÓN',
                            value: `> <t:${createdAt}:F>\n> <t:${createdAt}:R>`,
                            inline: false
                        },
                        { 
                            name: '💬 CANALES',
                            value: `> 📝 Texto: ${guild.channels.cache.filter(c => c.type === 0).size}\n> 🔊 Voz: ${guild.channels.cache.filter(c => c.type === 2).size}`,
                            inline: true
                        },
                        { 
                            name: '🎭 ROLES',
                            value: `> Cantidad: ${guild.roles.cache.size}\n> Color Principal: ${guild.roles.highest.name}`,
                            inline: true
                        }
                    ])
                    .setFooter({ 
                        text: `ID: ${guild.id} • Solicitado por ${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL({ dynamic: true })
                    })
                    .setImage(config.bannerGif) // Movido antes del setTimestamp
                    .setTimestamp();
                await message.reply({ embeds: [infoEmbed] });
                break;
            }
            
            case 'reglas': {
                const rulesEmbed = new EmbedBuilder()
                    .setColor(config.embedColors.primary)
                    .setAuthor({ 
                        name: '📜 Reglas del Servidor', 
                        iconURL: message.guild.iconURL({ dynamic: true }) 
                    })
                    .setDescription(config.rules.join('\n\n'))
                    .setImage(config.bannerGif) // Movido antes del setTimestamp
                    .setFooter({ 
                        text: '⚔️ El incumplimiento de estas reglas resultará en sanción', 
                        iconURL: client.user.displayAvatarURL() 
                    })
                    .setTimestamp();
                await message.reply({ embeds: [rulesEmbed] });
                break;
            }

            case 'ayuda': {
                const helpEmbed = new EmbedBuilder()
                    .setColor(config.embedColors.primary)
                    .setAuthor({ name: '📚 Centro de Ayuda', iconURL: client.user.displayAvatarURL() })
                    .setDescription('**Comandos disponibles en THO**\n\n' + 
                        Object.entries(config.commands)
                            .map(([cmd, desc]) => `> \`${config.prefix}${cmd}\` → ${desc}`)
                            .join('\n'))
                    .setFooter({ text: '🌟 THO - Tu Mejor Compañero', iconURL: message.guild.iconURL() })
                    .setImage(config.bannerGif) // Movido antes del setTimestamp
                    .setTimestamp();
                await message.reply({ embeds: [helpEmbed] });
                break;
            }

            case 'ping': {
                const pingEmbed = new EmbedBuilder()
                    .setColor(config.embedColors.primary)
                    .setAuthor({ name: '🏓 Ping del Bot', iconURL: client.user.displayAvatarURL() })
                    .setDescription(`> 📡 Latencia: **${client.ws.ping}ms**\n> ⚡ Estado: **Operativo**`)
                    .setImage(config.bannerGif) // Movido antes del setTimestamp
                    .setFooter({ text: '🔥 THO System', iconURL: message.guild.iconURL() })
                    .setTimestamp();
                await message.reply({ embeds: [pingEmbed] });
                break;
            }
        }
    }
});

// Mensajes aleatorios
setInterval(() => {
    const channel = client.channels.cache.get(config.generalChannelId);
    if (channel) {
        const randomMessage = config.randomMessages[Math.floor(Math.random() * config.randomMessages.length)];
        const randomEmbed = new EmbedBuilder()
            .setColor(config.embedColors.primary)
            .setAuthor({ 
                name: '💫 THO Bot', 
                iconURL: client.user.displayAvatarURL() 
            })
            .setDescription(randomMessage)
            .setImage(config.bannerGif) // Movido antes del setTimestamp
            .setFooter({ 
                text: '🌟 Mensaje Automático • THO Community', 
                iconURL: channel.guild.iconURL({ dynamic: true }) 
            })
            .setTimestamp();
        channel.send({ embeds: [randomEmbed] });
    }
}, 600000); 

client.login(config.token);
