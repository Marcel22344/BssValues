let valueList = {};
let isDataLoaded = false;
let dataFetchPromise = null;
let currentUser = null;
let currentListings = {};
let currentAuctions = {};
let currentReportedListingId = null;
let currentOpenModalItemName = null;
let currentListingId = null;
let socket = null;
const openChatWindows = {};
const MAX_OPEN_CHAT_WINDOWS = 3;
let totalUnreadMessages = 0;
let chatConversations = [];
let chatSearchTimeout = null;
let currentListingSortCriteria = 'newest';
let currentAuctionSortCriteria = 'ends_soon';
let tradeOfferYourItems = [];
let tradeOfferTheirItems = [];
let tradeOfferActiveTarget = null;
let tradeOfferSelectedItem = null;
let tradeOfferFuseStickers = null;
let tradeOfferFuseBeequips = null;
let tradeOfferFuseIcons = null;
let tradeOfferAllStickerItems = [];
let tradeOfferStickerGroups = [];
let tradeOfferBeequipItems = [];
let tradeOfferIconItems = [];
let tradeOfferActiveCategory = 'sticker';
let tradeOfferSelectedBeequipGroupKey = null;
let tradeOfferSelectedStickerGroupKey = null;
let selectedStarsForModal = 0;
let formSelectedWaxesForModal = [];
let currentBeequipDataForModal = null;
let beequipCustomizationModal = null;
let currentBeequipGroupKey = null;
let currentBeequipSubgroupKey = null;

const CHAT_MESSAGE_MAX_LENGTH_CLIENT_SIDE = 2000;
const LISTING_FIELD_MAX_LENGTH_CLIENT_SIDE = 200;
const REPORT_RATE_LIMIT_SECONDS_CLIENT_SIDE = 300;
const LISTING_RATE_LIMIT_SECONDS_CLIENT_SIDE = 1800;

const GLOBAL_CHAT_ID = '__global__';
const GLOBAL_CHAT_MESSAGE_MAX_LENGTH_CLIENT_SIDE = 500;
let isGlobalSendThrottled = false;

let discordPopup = null;
let closeDiscordPopupBtn = null;

let currentBeequipSortCriteria = 'value_desc'; // Default sort

const iconFileNames = [
    "Adds.png", "Apps.png", "Arts.png", "Bears.png", "Bee Ability Pollen.png",
    "Bee Attack.png", "Beequips.png", "Bees.png", "Beesmas.png", "Blue Beequips.png",
    "Blue Field Capacity.png", "Blue Stickers.png", "Boost Tokens.png", "Convert Rate.png",
    "Cubs.png", "Downgrade.png", "Flowers.png", "High Stat Beequips.png",
    "Hive Skins.png", "Honey At Hive.png", "Leafs.png", "Limited.png",
    "Low Stats.png", "Mid stats.png", "Miscellaneous.png", "Mobs.png",
    "Rarities.png", "Red Beequips.png", "Red Pollen.png", "Red Stickers.png",
    "SCP.png", "Service.png", "Stamps.png", "Star Signs.png",
    "Sticker Stacker.png", "Token Link.png", "Tools.png", "Unlimiteds.png",
    "Upgrade.png", "Vouchers.png", "White Beequips.png", "White Stickers.png"
];

const STAR_SIGNS_DATA = [
    { name: "Aquarius Star Sign", key: "Aquarius Star Sign", image: "/static/images/aquarius_star_sign.png", value_min: 1.00, value_max: 1.00, graph_value: 1.00, category: "Sticker" },
    { name: "Aries Star Sign", key: "Aries Star Sign", image: "/static/images/aries_star_sign.png", value_min: 1.00, value_max: 1.00, graph_value: 1.00, category: "Sticker" },
    { name: "Cancer Star Sign", key: "Cancer Star Sign", image: "/static/images/cancer_star_sign.png", value_min: 1.00, value_max: 1.00, graph_value: 1.00, category: "Sticker" },
    { name: "Capricorn Star Sign", key: "Capricorn Star Sign", image: "/static/images/capricorn_star_sign.png", value_min: 1.00, value_max: 1.00, graph_value: 1.00, category: "Sticker" },
    { name: "Gemini Star Sign", key: "Gemini Star Sign", image: "/static/images/gemini_star_sign.png", value_min: 1.00, value_max: 1.00, graph_value: 1.00, category: "Sticker" },
    { name: "Leo Star Sign", key: "Leo Star Sign", image: "/static/images/leo_star_sign.png", value_min: 1.00, value_max: 1.00, graph_value: 1.00, category: "Sticker" },
    { name: "Libra Star Sign", key: "Libra Star Sign", image: "/static/images/libra_star_sign.png", value_min: 1.00, value_max: 1.00, graph_value: 1.00, category: "Sticker" },
    { name: "Pisces Star Sign", key: "Pisces Star Sign", image: "/static/images/pisces_star_sign.png", value_min: 1.00, value_max: 1.00, graph_value: 1.00, category: "Sticker" },
    { name: "Sagittarius Star Sign", key: "Sagittarius Star Sign", image: "/static/images/sagittarius_star_sign.png", value_min: 1.00, value_max: 1.00, graph_value: 1.00, category: "Sticker" },
    { name: "Scorpio Star Sign", key: "Scorpio Star Sign", image: "/static/images/scorpio_star_sign.png", value_min: 1.00, value_max: 1.00, graph_value: 1.00, category: "Sticker" },
    { name: "Taurus Star Sign", key: "Taurus Star Sign", image: "/static/images/taurus_star_sign.png", value_min: 1.00, value_max: 1.00, graph_value: 1.00, category: "Sticker" },
    { name: "Virgo Star Sign", key: "Virgo Star Sign", image: "/static/images/virgo_star_sign.png", value_min: 1.00, value_max: 1.00, graph_value: 1.00, category: "Sticker" }
];

const baseBeequipDataFromScraped = {
    "Thimble": { buffs: ["+ Convert Amount", "+% Convert Amount"], debuffs: [], bonuses: ["+% Convert Rate", "x Convert Rate"], abilities: [] },
    "Sweatband": { buffs: ["+% Energy", "+% White Gather Amount", "+% Red Gather Amount", "+% Blue Gather Amount"], debuffs: [], bonuses: ["+% White Pollen", "+% Red Pollen", "+% Blue Pollen", "+% Max Bee Energy", "+% Pollen"], abilities: [] },
    "Bandage": { buffs: ["+ Gather Amount", "+% Energy", "+% Attack"], debuffs: [], bonuses: ["x Bee Attack"], abilities: [] },
    "Thumbtack": { buffs: ["+ Gather Amount", "+% Critical Power", "+% Attack", "+ Attack"], debuffs: [], bonuses: ["+% Red Bee Attack", "+% Bee Attack"], abilities: [] },
    "Camo Bandana": { buffs: ["+ Gather Amount", "+% Buzz Bomb Pollen", "+ Attack", "+% Critical Power", "+% Super Crit Power"], debuffs: [], bonuses: ["+% Buzz Bomb Pollen", "+% Pumpkin Patch Capacity", "+% Coconut Field Capacity", "+% Super-Crit Power"], abilities: [] },
    "Bottle Cap": { buffs: ["+ Convert Amount", "+% Critical Chance", "+% Critical Power"], debuffs: [], bonuses: ["+% Critical Power"], abilities: ["+Ability: Buzz Bomb"] },
    "Kazoo": { buffs: ["+% Convert Amount", "+% Critical Power"], debuffs: ["-% Energy"], bonuses: ["+% Critical Power", "+% Super-Crit Power"], abilities: ["+Ability: Melody"] },
    "Smiley Sticker": { buffs: ["+% Energy", "+% Bomb Pollen", "+% Critical Power", "+% Mark Duration"], debuffs: [], bonuses: ["+% Mark Duration", "+% Max Bee Energy"], abilities: ["+Ability: Honey Mark", "+Ability: Blue Bomb"] },
    "Whistle": { buffs: ["+% Movespeed", "+% Critical Power"], debuffs: ["-% Energy"], bonuses: ["+% Bee Movespeed", "+% Super-Crit Power", "x Player Movespeed"], abilities: ["+Ability: Haste", "+Ability: Melody"] },
    "Charm Bracelet": { buffs: ["+% Convert Amount", "+% Critical Chance", "+% Mark Duration", "+% Ability Rate"], debuffs: [], bonuses: ["+% Loot Luck", "+% Honey At Hive", "+% Convert Rate At Hive", "+% Honey From Tokens", "+% Blue Flower Field Pollen", "+% Dandelion Field Pollen", "+% Mushroom Field Pollen", "+% Sunflower Field Pollen"], abilities: ["+Ability: Melody"] },
    "Paperclip": { buffs: ["+% Ability Rate", "+% Ability Pollen", "+% Convert Rate At Hive"], debuffs: [], bonuses: ["+% Ability Token Lifespan", "+% Bee Ability Pollen"], abilities: ["+Ability: Token Link"] },
    "Beret": { buffs: ["+ Convert Amount", "+% Convert Amount", "+% Ability Pollen"], debuffs: [], bonuses: ["+ Capacity", "+% Blue Field Capacity", "+% Capacity"], abilities: ["+Ability: Blue Boost"] },
    "Bang Snap": { buffs: ["+% Bomb Pollen", "+% Critical Chance"], debuffs: [], bonuses: ["+ Instant Bomb Conversion", "+% Instant Buzz Bomb Conversion", "+% Red Bomb Conversion", "+% Blue Bomb Conversion"], abilities: ["+Ability: Buzz Bomb", "+Ability: Red Bomb", "+Ability: Blue Bomb", "+Ability: Buzz Bomb(+)", "+Ability: Red Bomb(+)", "+Ability: Blue Bomb(+)", "+Ability: Honey Mark"] },
    "Bead Lizard": { buffs: ["+% Convert Amount", "+% Gathering Flames Chance", "+% Gathering Bubbles Chance"], debuffs: [], bonuses: ["+% Bubble Pollen", "+% Flame Pollen", "+% Bee Ability Pollen"], abilities: ["+Ability: Token Link"] },
    "Pink Shades": { buffs: ["+% Ability", "+% Critical Power", "+% Critical Chance", "+% Super-Crit Chance"], debuffs: [], bonuses: ["+% Super-Crit Chance", "+% Super-Crit Power"], abilities: ["+Ability: Focus"] },
    "Lei": { buffs: ["+ Gather Amount", "+% Gather Amount", "+% Gather Pollination Chance", "+% Ability Rate"], debuffs: [], bonuses: ["+% Sunflower Field Pollen", "+% Blue Field Pollen", "+% Rose Field Pollen", "+% Coconut Field Pollen"], abilities: ["+Ability: Red Boost", "+Ability: Blue Boost"] },
    "Demon Talisman": { buffs: ["+% Attack", "+% Gather Amount", "+% Ability Pollen", "+% Gathering Flames Chance", "+% Super-Crit Chance"], debuffs: ["-% Movespeed", "-% Energy", "-% Max Bee Energy[Hive]", "- Player Movespeed[Hive]", "x- Blue Pollen[Hive]"], bonuses: ["+% Red Bomb Pollen", "+% Flame Pollen", "+% Instant Red Bomb Conversion", "+% Instant Flame Conversion", "+% Instant Demon Bee Conversion", "+% Super-Crit Power"], abilities: ["+Ability: Inferno"] },
    "Camphor Lip Balm": { buffs: ["+ Gather Amount", "+% Critical Power"], debuffs: [], bonuses: ["x Pepper Patch Pollen", "+% Bubble Pollen", "+% Gold Bubble Pollen", "+% Honey From Instant Conversion"], abilities: [] },
    "Autumn Sunhat": { buffs: ["+ Convert Amount", "+% Convert Amount", "+% White Gather Amount", "+% Ability Rate"], debuffs: [], bonuses: ["+ Capacity", "+% Sunflower Field Pollen", "+% Pumpkin Patch Pollen", "+% White Pollen", "+% White Field Capacity"], abilities: [] },
    "Rose Headband": { buffs: ["+ Attack", "+% Convert Amount", "+% Gather Pollination Chance", "+% Ability Rate", "+% Critical Chance"], debuffs: [], bonuses: ["+ Capacity", "+% Rose Field Pollen", "+% Red Field Capacity", "+% Instant Rose Field Conversion", "+% Bee Attack"], abilities: [] },
    "Pink Eraser": { buffs: ["+ Convert Amount", "+% Instant Conversion"], debuffs: ["-% Mark Duration"], bonuses: ["+% Instant Red Bomb Conversion", "+% Instant Bee Gather Conversion", "+% Honey From Instant Conversion", "+% Unique Instant Conversion"], abilities: [] },
    "Candy Ring": { buffs: ["+ Energy", "+% Convert Amount", "+% Abiltiy Rate"], debuffs: [], bonuses: ["+% Honey At Hive", "+% Honey Per Goo", "x Honey From Tokens"], abilities: [] },
    "Elf Cap": { buffs: ["+ Convert Amount", "+% Convert Rate At Hive"], debuffs: [], bonuses: ["+% Convert Rate At Hive", "+% Honey At Hive"], abilities: [] },
    "Single Mitten": { buffs: ["+ Gather Amount", "+% Bomb Pollen"], debuffs: [], bonuses: ["+ Capacity", "+% Red Pollen"], abilities: [] },
    "Warm Scarf": { buffs: ["+% Convert Amount", "+% Energy"], debuffs: [], bonuses: ["+% Red Field Capacity", "+% White Field Capacity", "+% Capacity"], abilities: [] },
    "Peppermint Antennas": { buffs: ["+% Convert Amount", "+% Gather Amount", "+% Movespeed", "+% Ability Rate", "+% Ability Pollen"], debuffs: [], bonuses: ["+% Bee Ability Rate"], abilities: [] },
    "Beesmas Top": { buffs: ["+% Critical Chance", "+% Ability Rate", "+% Energy", "+ Attack"], debuffs: ["-% Energy"], bonuses: ["+% Critical Power"], abilities: [] },
    "Pinecone": { buffs: ["+% Convert Amount", "+% Ability Rate"], debuffs: [], bonuses: ["+% Pine Tree Forest Capacity", "+% Pine Tree Forest Pollen"], abilities: [] },
    "Icicles": { buffs: ["+% Attack", "+% Blue Bomb Pollen"], debuffs: [], bonuses: ["+% Cactus Field Pollen", "+% Blue Bomb Pollen", "+% Monster Respawn Time"], abilities: [] },
    "Beesmas Tree Hat": { buffs: ["+% Convert Amount", "+% Critical Chance", "+% Ability Pollen", "+% Ability Rate"], debuffs: [], bonuses: ["+ Capacity", "+% Convert Rate At Hive"], abilities: [] },
    "Bubble Light": { buffs: ["+ Convert Amount", "+ Movespeed", "+% Bubble Pollen", "+% Mark Duration"], debuffs: [], bonuses: ["+% Bubble Pollen", "+% Bee Movespeed"], abilities: [] },
    "Snow Tiara": { buffs: ["+% Convert Amount", "+% Convert At Hive", "+% Blue Gather Amount", "+% White Gather Amount", "+% Critical Chance"], debuffs: [], bonuses: ["+% Blue Field Capacity", "+% White Field Capacity", "+% Honey From Tokens"], abilities: [] },
    "Snowglobe": { buffs: ["+% Bomb Pollen", "+% Ability Rate"], debuffs: [], bonuses: ["+% Bomb Pollen"], abilities: ["+Ability: Snowglobe Shake"] },
    "Reindeer Antlers": { buffs: ["+% Convert Amount", "+% Ability Pollen"], debuffs: [], bonuses: ["+% Capacity", "+% Bond From Treats"], abilities: ["+Ability: Focus", "+Ability: Reindeer Fetch", "+Ability: Baby Love"] },
    "Toy Horn": { buffs: ["+ Convert Amount", "+% Ability Pollen", "+% Ability Rate"], debuffs: ["-% Energy"], bonuses: ["+% Bee Ability Pollen", "+% Convert Rate"], abilities: ["+Ability: Melody"] },
    "Paper Angel": { buffs: ["+% White Gather", "+% Ability Pollen"], debuffs: [], bonuses: ["+% Ability Token Lifespan", "+% Bee Ability Pollen"], abilities: ["+Ability: Token Link"] },
    "Toy Drum": { buffs: ["+ Gather Amount", "+% Attack", "+% Critical Chance"], debuffs: ["-% Energy"], bonuses: ["+% Bee Ability Pollen"], abilities: ["+Ability: Haste"] },
    "Lump Of Coal": { buffs: ["+% Bomb Pollen"], debuffs: ["-% Energy", "+% Movespeed"], bonuses: ["+% Bomb Pollen", "+% Buzz Bomb Pollen", "+% Blue Bomb Pollen", "+% Red Bomb Pollen", "+% Pollen", "+% White Pollen", "+% Red Pollen", "+% Blue Pollen"], abilities: [] },
    "Poinsettia": { buffs: ["+% Red Gather Amount", "+% Gather Pollination Chance"], debuffs: [], bonuses: ["+% Bee Gather Pollen", "+% Red Pollen"], abilities: [] },
    "Electric Candle": { buffs: ["+ Red Gather Amount", "+% Flames Pollen", "+% Gathering Flames Chance", "+% Energy"], debuffs: [], bonuses: ["+% Flames Pollen"], abilities: [] },
    "Festive Wreath": { buffs: ["+ Gather Amount", "+ Convert Amount", "+% Red Bomb Pollen", "+% Mark Duration", "+% Ability Rate"], debuffs: [], bonuses: ["+% Capacity", "+% Ticket Chance", "+% Red Bee Convert Rate", "+% Honey At Hive"], abilities: ["+Ability: Festive Mark"] }
};

const STICKER_TO_GROUP_MAP = {
    // Cub Skins
    "Robo Cub": "Cub Skins", "Doodle Cub": "Cub Skins", "Gingerbread Cub": "Cub Skins", "Star Cub": "Cub Skins", "Noob Cub": "Cub Skins", "Peppermint Cub": "Cub Skins", "Brown Cub": "Cub Skins", "Snow Cub": "Cub Skins", "Stick Cub": "Cub Skins", "Bee Cub": "Cub Skins", "Gloomy Cub": "Cub Skins",
    // Hive Skins
    "Green Hive Skin": "Hive Skins", "Red Hive Skin": "Hive Skins", "Blue Hive Skin": "Hive Skins", "Pink Hive Skin": "Hive Skins", "Black Hive Skin": "Hive Skins", "White Hive Skin": "Hive Skins", "Doodle Hive Skin": "Hive Skins", "Wavy Gold Hive Skin": "Hive Skins", "Wavy Cyan Hive Skin": "Hive Skins", "Wavy Purple Hive Skin": "Hive Skins", "Wavy Festive Hive Skin": "Hive Skins", "Icy Crowned Hive Skin": "Hive Skins",
    // Vouchers
    "Bear Bee Voucher": "Vouchers", "Cub Voucher": "Vouchers", "Bee Gather Voucher": "Vouchers", "Convert Speed Voucher": "Vouchers",
    // Bees
    "Rad Bee": "Bees", "Ninja Bee": "Bees", "Brave Bee": "Bees", "Photon Bee": "Bees", "Drooping Stubborn Bee": "Bees", "Looker Bee": "Bees", "Bumble Bee": "Bees", "Rascal Bee": "Bees", "Basic Bee": "Bees", "Diamond Diamond Bee": "Bees", "4-Pronged Vector Bee": "Bees", "Shocked Hive Slot": "Bees", "Bear Bee Offer": "Bees", "Tabby Scratch": "Bees", "Tabby From Behind": "Bees", "Fuzz Bomb": "Bees", "Precise Eye": "Bees",
    // Bears
    "Chef Hat Polar Bear": "Bears", "Honey Bee Bear": "Bears", "Bomber Bear": "Bears", "Uplooking Bear": "Bears", "Sitting Green Shirt Bear": "Bears", "Shy Brown Bear": "Bears", "Sitting Mother Bear": "Bears", "Squashed Head Bear": "Bears", "Stretched Head Bear": "Bears", "Panicked Science Bear": "Bears", "Dapper Bear From Above": "Bears", "Sideways Spirit Bear": "Bears", "Glowering Gummy Bear": "Bears", "Sunbear": "Bears",
    // Mobs
    "Menacing Mantis": "Mobs", "Little Scorpion": "Mobs", "Left Facing Ant": "Mobs", "Walking Stick Nymph": "Mobs", "Forward Facing Spider": "Mobs", "Forward Facing Aphid": "Mobs", "Right Facing Stump Snail": "Mobs", "Standing Bean Bug": "Mobs", "Small Blue Chick": "Mobs", "Tadpole": "Mobs", "Happy Fish": "Mobs", "Coiled Snake": "Mobs", "Standing Caterpillar": "Mobs", "Round Green Critter": "Mobs", "Flying Magenta Critter": "Mobs", "Blue Triangle Critter": "Mobs", "Purple Pointed Critter": "Mobs", "Orange Leg Critter": "Mobs",
    // Art
    "Red Doodle Person": "Art", "Pearl Girl": "Art", "Abstract Color Painting": "Art", "Prism Painting": "Art", "Banana Painting": "Art", "Moai": "Art", "Nessie": "Art", "Ionic Column Top": "Art", "Ionic Column Middle": "Art", "Ionic Column Base": "Art", "Orange Step Array": "Art", "Orange Green Tri Deco": "Art",
    // Gems
    "Orange Swirled Marble": "Gems", "Blue And Green Marble": "Gems", "Yellow Swirled Marble": "Gems", "Diamond Cluster": "Gems", "Diamond Trim": "Gems", "Cyan Decorative Border": "Gems", "Left Gold Swirl Fleuron": "Gems", "Right Gold Swirl Fleuron": "Gems", "Left Shining Diamond Fleuron": "Gems", "Right Shining Diamond Fleuron": "Gems", "Left Mythic Gem Fleuron": "Gems", "Right Mythic Gem Fleuron": "Gems", "Purple Fleuron": "Gems", "Royal Symbol": "Gems", "Royal Bear": "Gems", "Mythic M": "Gems",
    // Nectar Icons
    "Satisfying Nectar Icon": "Nectar Icons", "Refreshing Nectar Icon": "Nectar Icons", "Motivating Nectar Icon": "Nectar Icons", "Invigorating Nectar Icon": "Nectar Icons", "Comforting Nectar Icon": "Nectar Icons",
    // Flowers
    "Small Tickseed": "Flowers", "Small White Daisy": "Flowers", "Small Pink Tulip": "Flowers", "Small Dandelion": "Flowers", "Purple 4-Point Flower": "Flowers",
    // Mushrooms
    "Spore Covered Puffshroom": "Mushrooms", "White Button Mushroom": "Mushrooms", "Fly Agaric Mushroom": "Mushrooms", "Porcini Mushroom": "Mushrooms", "Oiler Mushroom": "Mushrooms", "Morel Mushroom": "Mushrooms", "Chanterelle Mushroom": "Mushrooms", "Shiitake Mushroom": "Mushrooms", "Black Truffle Mushroom": "Mushrooms", "Prismatic Mushroom": "Mushrooms",
    // Leaves
    "Blowing Leaf": "Leaves", "Cordate Leaf": "Leaves", "Cunate Leaf": "Leaves", "Elliptic Leaf": "Leaves", "Hastate Leaf": "Leaves", "Lanceolate Leaf": "Leaves", "Lyrate Leaf": "Leaves", "Oblique Leaf": "Leaves", "Reniform Leaf": "Leaves", "Rhomboid Leaf": "Leaves", "Spatulate Leaf": "Leaves",
    // Tools
    "Scooper": "Tools", "Rake": "Tools", "Clippers": "Tools", "Magnet": "Tools", "Vacuum": "Tools", "Super-Scooper": "Tools", "Pulsar": "Tools", "Electro-Magnet": "Tools", "Scissors": "Tools", "Honey Dipper": "Tools", "Bubble Wand": "Tools", "Scythe": "Tools", "Golden Rake": "Tools", "Spark Staff": "Tools", "Porcelain Dipper": "Tools", "Petal Wand": "Tools", "Tide Popper": "Tools", "Dark Scythe": "Tools", "Gummyballer": "Tools",
    // Stamps
    "Sunflower Field Stamp": "Stamps", "Dandelion Field Stamp": "Stamps", "Mushroom Field Stamp": "Stamps", "Blue Flower Field Stamp": "Stamps", "Clover Field Stamp": "Stamps", "Strawberry Field Stamp": "Stamps", "Spider Field Stamp": "Stamps", "Bamboo Field Stamp": "Stamps", "Pineapple Patch Stamp": "Stamps", "Stump Field Stamp": "Stamps", "Cactus Field Stamp": "Stamps", "Pumpkin Patch Stamp": "Stamps", "Pine Tree Forest Stamp": "Stamps", "Rose Field Stamp": "Stamps", "Hub Field Stamp": "Stamps", "Mountain Top Field Stamp": "Stamps", "Pepper Patch Stamp": "Stamps", "Coconut Field Stamp": "Stamps", "Ant Field Stamp": "Stamps",
    // Beesmas
    "Green Beesmas Light": "Beesmas", "Blue Beesmas Light": "Beesmas", "Red Beesmas Light": "Beesmas", "Yellow Beesmas Light": "Beesmas", "Critter In A Stocking": "Beesmas", "Flying Festive Bee": "Beesmas", "Flying Bee Bear": "Beesmas", "Party Robo Bear": "Beesmas", "Festive Pufferfish": "Beesmas", "Festive Pea": "Beesmas", "BBM From Below": "Beesmas",
    // Miscellaneous (The default/fallback category)
    "Green Plus Sign": "Miscellaneous", "Green Check Mark": "Miscellaneous", "Red X": "Miscellaneous", "Alert Icon": "Miscellaneous", "Yellow Right Arrow": "Miscellaneous", "Yellow Left Arrow": "Miscellaneous", "Simple Sun": "Miscellaneous", "Pink Cupcake": "Miscellaneous", "Rubber Duck": "Miscellaneous", "Baseball Swing": "Miscellaneous", "Yellow Coffee Mug": "Miscellaneous", "Launching Rocket": "Miscellaneous", "Thumbs Up Hand": "Miscellaneous", "Peace Sign Hand": "Miscellaneous", "Traffic Light": "Miscellaneous", "Window": "Miscellaneous", "Simple Skyscraper": "Miscellaneous", "Simple Mountain": "Miscellaneous", "Pale Heart": "Miscellaneous", "Colorful Buttons": "Miscellaneous", "Giraffe": "Miscellaneous", "Silly Tongue": "Miscellaneous", "White Flag": "Miscellaneous", "Pyramid": "Miscellaneous", "Tiny House": "Miscellaneous", "TNT": "Miscellaneous", "Wishbone": "Miscellaneous", "Yellow Umbrella": "Miscellaneous", "Red Palm Hand": "Miscellaneous", "Yellow Sticky Hand": "Miscellaneous", "Yellow Walking Wiggly Person": "Miscellaneous", "Green Sell": "Miscellaneous", "Yellow Hi": "Miscellaneous", "AFK": "Miscellaneous", "Auryn": "Miscellaneous", "Pink Chair": "Miscellaneous", "Doodle S": "Miscellaneous", "Triple Exclamation": "Miscellaneous", "Eighth Note": "Miscellaneous", "Eviction": "Miscellaneous", "Fork And Knife": "Miscellaneous", "Shining Halo": "Miscellaneous", "Rhubarb": "Miscellaneous", "Sprout": "Miscellaneous", "Palm Tree": "Miscellaneous", "Jack-0-Lantern": "Miscellaneous", "Lightning": "Miscellaneous", "Simple Cloud": "Miscellaneous", "Grey Raining Cloud": "Miscellaneous", "Tornado": "Miscellaneous", "Small Flame": "Miscellaneous", "Dark Flame": "Miscellaneous", "Small Shield": "Miscellaneous", "Robot Head": "Miscellaneous", "Cyan Hilted Sword": "Miscellaneous", "Cool Backpack": "Miscellaneous", "Standing Beekeeper": "Miscellaneous", "Red Wailing Cry": "Miscellaneous", "Hourglass": "Miscellaneous", "Atom Symbol": "Miscellaneous", "Barcode": "Miscellaneous", "Wall Crack": "Miscellaneous", "Green Circle": "Miscellaneous", "Blue Square": "Miscellaneous", "Black Diamond": "Miscellaneous", "Waxing Crescent Moon": "Miscellaneous", "Glowing Smile": "Miscellaneous", "Saturn": "Miscellaneous", "Black Star": "Miscellaneous", "Cyan Star": "Miscellaneous", "Shining Star": "Miscellaneous", "Grey Diamond Logo": "Miscellaneous", "Orphan Dog": "Miscellaneous", "Pizza Delivery Man": "Miscellaneous", "Interrobang Block": "Miscellaneous", "Theatrical Intruder": "Miscellaneous", "Desperate Booth": "Miscellaneous", "Built Ship": "Miscellaneous", "Grey Shape Companion": "Miscellaneous", "Evil Pig": "Miscellaneous", "Waving Townsperson": "Miscellaneous", "Cop And Robber": "Miscellaneous", "Tough Potato": "Miscellaneous", "Young Elf": "Miscellaneous", "Shrugging Heart": "Miscellaneous", "Classic Killroy": "Miscellaneous", "Killroy With Hair": "Miscellaneous", "Taunting Doodle Person": "Miscellaneous", "Prehistoric Hand": "Miscellaneous", "Prehistoric Boar": "Miscellaneous"
};
 

function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    const escapeMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return str.replace(/[&<>"']/g, match => escapeMap[match]);
}

function toggleLoadingIndicator(show) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) loadingIndicator.style.display = show ? 'block' : 'none';
}

function isMobileView() { return window.innerWidth <= 768; }

function calculateGraphValue(valueMin, valueMax) {
    const minF = parseValueFromString(valueMin);
    const maxF = parseValueFromString(valueMax);

    if (minF !== null && maxF !== null) {
         return parseFloat(((minF + maxF) / 2).toFixed(3));
    } else if (minF !== null) {
        return minF;
    } else if (maxF !== null) {
        return maxF;
    }
    return null;
}

function formatValueDisplay(valueMin, valueMax, graphValue, forModal = false) {
    if (valueMin === null && valueMax === null) return 'N/A (Group)';

    const smartFormat = (num) => {
        if (num === null || typeof num === 'undefined') return 'N/A';
        const n = Number(num);
        if (isNaN(n)) return String(num);
        return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const renderFormula = (formulaStr) => {
        if (!formulaStr) return '';
        formulaStr = String(formulaStr); // Ensure it's a string

        // Regex to find multipliers like "2.5*" or items like "{BeeCub}" or operators
        const parts = formulaStr.match(/(\d+(\.\d+)?\s*[*]\s*)?\{[^}]+\}|[+\-/*()]|\d+(\.\d+)?/g) || [];
        let htmlOutput = '';

        parts.forEach(part => {
            part = part.trim();
            const multiplierMatch = part.match(/^(\d+(\.\d+)?)\s*[*]\s*/);
            const itemNameMatch = part.match(/\{([^}]+)\}/);

            if (itemNameMatch) {
                const itemName = itemNameMatch[1].trim();
                const itemData = valueList[itemName];
                const itemImageSrc = (itemData && itemData.image) ? escapeHTML(itemData.image) : 'https://via.placeholder.com/50?text=?';
                const itemImageHTML = `<img src="${itemImageSrc}" class="value-cub-icon" alt="${escapeHTML(itemName )}" title="${escapeHTML(itemName)}">`;

                if (multiplierMatch) {
                    const count = parseFloat(multiplierMatch[1]);
                    const fullCount = Math.floor(count);
                    const hasHalf = (count - fullCount) >= 0.5;

                    for (let i = 0; i < fullCount; i++) {
                        htmlOutput += itemImageHTML;
                    }
                    if (hasHalf) {
                        htmlOutput += `<div class="value-cub-icon-wrapper half"><div class="value-cub-icon-half" style="background-image: url('${itemImageSrc}');"></div></div>`;
                    }
                } else {
                    // Handle cases like "{Bee Cub} + {Rad Bee}"
                    const plusSyntaxMatch = formulaStr.match(/\{[^}]+\}\s*\+\s*\{[^}]+\}/);
                    if (plusSyntaxMatch) {
                        // This is part of a sum, just add the image
                        htmlOutput += itemImageHTML;
                    } else {
                        // Default to one image if no multiplier
                        htmlOutput += itemImageHTML;
                    }
                }
            } else if (part) {
                // Handle operators and other numbers
                htmlOutput += `<span class="component-operator">${escapeHTML(part)}</span>`;
            }
        });

        return htmlOutput.trim();
    };

    const isFormula = (val) => typeof val === 'string' && val.includes('{');

    const hasFormula = isFormula(valueMin) || isFormula(valueMax);

    if (hasFormula) {
        const avgValStr = graphValue !== null ? ` (Avg: ${smartFormat(graphValue)})` : '';
        const renderedMin = renderFormula(valueMin);
        
        if (valueMin === valueMax || valueMax === null || valueMax === '') {
            return `${renderedMin}${avgValStr} Signs`;
        } else {
            const renderedMax = renderFormula(valueMax);
            return `${renderedMin} to ${renderedMax}${avgValStr} Signs`;
        }
    }

    // Fallback for purely numeric values
    const minF = parseValueFromString(valueMin);
    const maxF = parseValueFromString(valueMax);

    if (minF !== null) {
        const effectiveMaxF = (maxF === null) ? minF : maxF;
        if (minF === effectiveMaxF) {
            return `${smartFormat(minF)} Signs`;
        } else {
            const gVal = graphValue !== null ? graphValue : ((minF + effectiveMaxF) / 2);
            const rangeStr = `${smartFormat(minF)} - ${smartFormat(effectiveMaxF)}`;
            const avgValStr = gVal !== null ? ` (Avg: ${smartFormat(gVal)})` : '';
            return `${rangeStr}${avgValStr} Signs`;
        }
    }

    return 'N/A (Invalid)';
}

function parseValueFromString(value) {
    if (value === null || typeof value === 'undefined') return null;
    if (typeof value === 'number' && isFinite(value)) return value;
    if (typeof value === 'string') {
        // First, try direct parse for simple numbers that are strings
        const directParse = parseFloat(value);
        if (!isNaN(directParse) && isFinite(directParse) && String(directParse) === value.trim()) {
             return directParse;
        }
        // If that fails, check for special formats by extracting the number
        const match = value.match(/\d+(\.\d+)?/);
        if (match) {
            const num = parseFloat(match[0]);
            if (!isNaN(num)) return num;
        }
    }
    return null;
}

function initializeBeequipCustomizationModal() {
    beequipCustomizationModal = document.getElementById('beequip-modal');
    const closeBtn = document.getElementById('close-beequip-modal');
    const confirmBtn = document.getElementById('confirm-beequip-modal');
    const starsContainer = document.getElementById('stars-rating-modal');
    const waxOptions = document.querySelectorAll('.wax-option-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeMyBeequipCustomizationModal);
    if (confirmBtn) confirmBtn.addEventListener('click', confirmMyBeequipCustomization);
    if (starsContainer) starsContainer.addEventListener('click', (event) => { if (event.target.tagName === 'SPAN' && event.target.dataset.value) setStarsForModal(parseInt(event.target.dataset.value)); });
    waxOptions.forEach(option => option.addEventListener('click', function() { if (formSelectedWaxesForModal.length < 5) { formSelectedWaxesForModal.push({ type: this.dataset.waxType, src: this.src, alt: this.alt }); renderSelectedWaxesInModal(); } else alert("Maximum 5 waxes allowed."); }));
    if (beequipCustomizationModal) { generateStarsForModal(0); initializeWaxSlotsInModal(); }
}

function checkLoginStatus() {
    const currentPath = window.location.pathname;
    fetch('/api/user', { credentials: 'include', cache: 'no-store' })
    .then(response => response.json())
    .then(data => {
        currentUser = data.logged_in ? data : null;
        if (currentUser) {
            if (currentUser.banned) {
                console.log("Server /api/user confirms ban. Setting localStorage, redirecting to /banned-display-page.");
                localStorage.setItem('bssmUserBanned', 'true');
                localStorage.setItem('bssmBanReason', currentUser.reason || "Your account has been restricted.");
                if (currentPath !== '/banned-display-page') window.location.href = '/banned-display-page';
                else { const reasonTextElement = document.querySelector('.banned-page-content .ban-reason-text strong'); if(reasonTextElement) reasonTextElement.textContent = escapeHTML(currentUser.reason || "Your account access has been restricted.");}
            } else {
                if (localStorage.getItem('bssmUserBanned') === 'true') { console.log("Server /api/user confirms NOT banned, but client had flag. Clearing flags."); }
                localStorage.removeItem('bssmUserBanned'); localStorage.removeItem('bssmBanReason'); hideBanOverlay();
                if (currentPath === '/banned-display-page') { console.log("Was on /banned-display-page, but server says not banned. Redirecting home."); window.location.href = '/'; return; }
                // Add the call to the new function here
                setTimeout(checkAndShowDiscordPopup, 15000); // Check after 15 seconds
            }
        } else {
            const clientHadBanFlagAtStart = localStorage.getItem('bssmUserBanned') === 'true';
            if (clientHadBanFlagAtStart) {
                console.log("User not logged in, but client-side ban flag exists. Redirecting to /banned-display-page.");
                if (currentPath !== '/banned-display-page') { window.location.href = '/banned-display-page'; return; }
            }
        }
        updateUserProfileAndMobileActions();
        const marketContent = document.getElementById('marketContent'), marketLoginPrompt = document.getElementById('marketLoginPrompt'), chatLauncher = document.getElementById('chatLauncher');
        if (!currentUser || (currentUser && currentUser.banned)) {
            if (marketContent) marketContent.style.display = 'none';
            if (marketLoginPrompt && !(currentUser && currentUser.banned) ) marketLoginPrompt.style.display = 'block';
            else if (marketLoginPrompt) marketLoginPrompt.style.display = 'none';
            closeAdminPanel(); disconnectSocket(); if (chatLauncher) chatLauncher.style.display = 'none'; hideRobloxVerificationOverlay();
        } else {
            if (marketContent) marketContent.style.display = 'block';
            if (marketLoginPrompt) marketLoginPrompt.style.display = 'none';
            initializeChat(); if (chatLauncher) chatLauncher.style.display = 'flex';
            if (!currentUser.roblox_verified) showRobloxVerificationOverlay();
            else hideRobloxVerificationOverlay();
        }
    })
    .catch(error => {
        console.error('Error checking login status (/api/user call failed):', error);
        const clientHadBanFlagOnAPIError = localStorage.getItem('bssmUserBanned') === 'true';
        if (clientHadBanFlagOnAPIError && currentPath !== '/banned-display-page') { console.warn("API /user check failed, but client-side ban flag exists. Redirecting to /banned-display-page as a precaution."); window.location.href = '/banned-display-page'; return; }
        currentUser = null; updateUserProfileAndMobileActions(); disconnectSocket();
        const chatLauncher = document.getElementById('chatLauncher'); if (chatLauncher) chatLauncher.style.display = 'none';
        hideRobloxVerificationOverlay(); hideBanOverlay();
    });
}

async function checkAndShowDiscordPopup() {
    if (!currentUser || currentUser.banned) return;
    if (sessionStorage.getItem('discordPopupShownThisSession')) return;

    try {
        const response = await fetch('/api/user/guild-status');
        if (!response.ok) {
            console.warn('Could not check guild status, skipping popup.');
            // Still set the session storage item to avoid re-checking on a failed API
            sessionStorage.setItem('discordPopupShownThisSession', 'true');
            return;
        }
        const data = await response.json();
        
        if (!data.bssai_member || !data.market_member) {
            if(discordPopup) discordPopup.style.display = 'flex';
            sessionStorage.setItem('discordPopupShownThisSession', 'true');
        } else {
            // User is in both, so we can mark it as "shown" to not check again
            sessionStorage.setItem('discordPopupShownThisSession', 'true');
        }

    } catch (error) {
        console.error('Error checking guild status:', error);
        sessionStorage.setItem('discordPopupShownThisSession', 'true');
    }
}

function closeDiscordPopup() {
    if (discordPopup) discordPopup.style.display = 'none';
    sessionStorage.setItem('discordPopupShownThisSession', 'true');
}

function showRobloxVerificationOverlay() {
    const overlay = document.getElementById('robloxVerificationOverlay'), title = document.getElementById('robloxVerificationTitle'), instructions = document.getElementById('robloxVerificationInstructions'), usernameEntry = document.getElementById('robloxUsernameEntry'), codeDisplay = document.getElementById('robloxCodeDisplay'), messageEl = document.getElementById('robloxVerificationMessage'), usernameInput = document.getElementById('robloxUsernameInput'), modalContent = document.getElementById('robloxVerificationModal');
    if (overlay) overlay.style.display = 'flex';
    if (title) title.textContent = "Verify Your Roblox Account";
    if (instructions) instructions.textContent = "To access all features, please link your Roblox account.";
    if (usernameEntry) usernameEntry.style.display = 'block';
    if (codeDisplay) codeDisplay.style.display = 'none';
    if (messageEl) messageEl.textContent = '';
    if(usernameInput) usernameInput.value = '';
    if (modalContent) { if (document.body.classList.contains('dark-mode')) { modalContent.style.backgroundColor = 'var(--dark-modal-content)'; modalContent.style.color = 'var(--dark-text-color)'; } else { modalContent.style.backgroundColor = 'var(--modal-content)'; modalContent.style.color = 'var(--text-color)'; } }
}

function hideRobloxVerificationOverlay() { const overlay = document.getElementById('robloxVerificationOverlay'); if (overlay) overlay.style.display = 'none'; }

async function requestRobloxCode() {
    if (!currentUser) return;
    toggleLoadingIndicator(true);
    const messageEl = document.getElementById('robloxVerificationMessage'), codeDisplay = document.getElementById('robloxCodeDisplay'), verificationCodeElement = document.getElementById('verificationCodeElement'), robloxUsernameInput = document.getElementById('robloxUsernameInput');
    if (messageEl) messageEl.textContent = '';
    try {
        const response = await fetch('/api/roblox/request-verification-code', { method: 'POST', credentials: 'include' });
        const data = await response.json();
        toggleLoadingIndicator(false);
        if (response.ok) {
            if (verificationCodeElement) verificationCodeElement.textContent = data.code;
            if (codeDisplay) codeDisplay.style.display = 'block';
            if (robloxUsernameInput) robloxUsernameInput.disabled = true;
            const requestCodeBtn = document.getElementById('requestRobloxCodeButton');
            if (requestCodeBtn) requestCodeBtn.disabled = true;
            if (messageEl) { messageEl.textContent = 'Code generated. Follow instructions above.'; messageEl.style.color = 'green'; }
        } else {
            if (data.verified) { if (messageEl) { messageEl.textContent = 'Your Roblox account is already verified!'; messageEl.style.color = 'green'; } currentUser.roblox_verified = true; if(data.roblox_id) currentUser.roblox_id = data.roblox_id; if(data.roblox_username) currentUser.roblox_username = data.roblox_username; setTimeout(hideRobloxVerificationOverlay, 2000); }
            else if (data.error === "banned") { showBanOverlay(data.reason || "This account is banned."); }
            else { if (messageEl) { messageEl.textContent = `Error: ${escapeHTML(data.error) || 'Could not get code.'}`; messageEl.style.color = 'red'; } }
        }
    } catch (error) { toggleLoadingIndicator(false); console.error("Error requesting Roblox code:", error); if (messageEl) { messageEl.textContent = 'Network error. Please try again.'; messageEl.style.color = 'red'; } }
}

async function checkRobloxVerification() {
    if (!currentUser) return;
    const robloxUsernameInput = document.getElementById('robloxUsernameInput'), messageEl = document.getElementById('robloxVerificationMessage');
    const robloxUsername = robloxUsernameInput ? robloxUsernameInput.value.trim() : '';
    if (!robloxUsername) { if (messageEl) { messageEl.textContent = 'Please enter your Roblox username.'; messageEl.style.color = 'red'; } return; }
    toggleLoadingIndicator(true); if (messageEl) messageEl.textContent = 'Checking...';
    try {
        const response = await fetch('/api/roblox/check-verification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ roblox_username: robloxUsername }), credentials: 'include' });
        const data = await response.json();
        toggleLoadingIndicator(false);
        if (response.ok && data.verified) {
            currentUser.roblox_verified = true; currentUser.roblox_id = data.roblox_id; currentUser.roblox_username = data.roblox_username;
            if (messageEl) { messageEl.textContent = 'Roblox account verified successfully!'; messageEl.style.color = 'green'; }
            updateUserProfileAndMobileActions(); setTimeout(hideRobloxVerificationOverlay, 2000);
        } else {
             if (data.error === "banned") showBanOverlay(data.reason || "This account is banned.");
             else { if (messageEl) { messageEl.textContent = `Error: ${escapeHTML(data.error) || 'Verification failed.'}`; messageEl.style.color = 'red'; } if (robloxUsernameInput) robloxUsernameInput.disabled = false; const requestCodeBtn = document.getElementById('requestRobloxCodeButton'); if (requestCodeBtn) requestCodeBtn.disabled = false; }
        }
    } catch (error) { toggleLoadingIndicator(false); console.error("Error checking Roblox verification:", error); if (messageEl) { messageEl.textContent = 'Network error. Please try again.'; messageEl.style.color = 'red'; } }
}

function showBanOverlay(reason) {
    const overlay = document.getElementById('banOverlay'), reasonEl = document.getElementById('banReason');
    if (overlay && reasonEl) { localStorage.setItem('bssmUserBanned', 'true'); localStorage.setItem('bssmBanReason', reason || "Your account has been restricted."); reasonEl.textContent = escapeHTML(reason || "Your account has been restricted."); overlay.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
    disconnectSocket();
}

function hideBanOverlay() { const overlay = document.getElementById('banOverlay'); if (overlay) { overlay.style.display = 'none'; document.body.style.overflow = ''; } }

function logoutAndRedirectHome() { window.location.href = '/logout'; }

function updateUserProfileAndMobileActions() {
    const userProfileDesktop = document.getElementById('userProfile'), adminToggleDesktop = document.getElementById('adminPanelToggle'), mobileBottomBar = document.getElementById('mobileBottomBar');
    if (userProfileDesktop) {
        if (currentUser && !currentUser.banned) {
            let avatarUrl = currentUser.avatar ? `https://cdn.discordapp.com/avatars/${currentUser.discord_id}/${currentUser.avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png';
            let robloxInfoHtml = currentUser.roblox_verified && currentUser.roblox_username ? `<span class="user-roblox-name" style="font-size:0.75em; color: #bdc3c7; margin-left: 5px;">(@${escapeHTML(currentUser.roblox_username)})</span>` : '';
            let badgeHtml = currentUser.is_admin ? '<span class="admin-badge">Admin</span>' : (currentUser.is_moderator ? '<span class="admin-badge" style="background-color: var(--secondary-color);">Moderator</span>' : '');
            userProfileDesktop.innerHTML = `<div class="user-info"><img src="${avatarUrl}" alt="Avatar" class="user-avatar"><span class="user-name">${escapeHTML(currentUser.username)}</span>${robloxInfoHtml}${badgeHtml}</div><button onclick="logout()" class="logout-button desktop-logout-button">Logout</button>`;
        } else if (currentUser && currentUser.banned) userProfileDesktop.innerHTML = `<span style="color:red; font-weight:bold;">Account Restricted</span> <button onclick="logoutAndRedirectHome()" class="logout-button desktop-logout-button">Logout</button>`;
        else userProfileDesktop.innerHTML = `<button onclick="redirectToDiscordLogin()" class="login-button desktop-login-button"><img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_white_RGB.png" alt="Discord"> Login</button>`;
    }
    if (adminToggleDesktop) adminToggleDesktop.style.display = (currentUser && currentUser.is_admin && !currentUser.banned && !isMobileView()) ? 'flex' : 'none';
    if (mobileBottomBar) {
        mobileBottomBar.innerHTML = ''; let hasMobileActions = false;
        if (currentUser && !currentUser.banned) { const logoutBtnMobile = document.createElement('button'); logoutBtnMobile.textContent = 'Logout'; logoutBtnMobile.className = 'mobile-action-button mobile-logout-button'; logoutBtnMobile.onclick = logout; mobileBottomBar.appendChild(logoutBtnMobile); hasMobileActions = true; if (currentUser.is_admin) { const adminBtnMobile = document.createElement('button'); adminBtnMobile.innerHTML = '🛠️ Admin'; adminBtnMobile.className = 'mobile-action-button mobile-admin-button'; adminBtnMobile.onclick = toggleAdminPanel; mobileBottomBar.appendChild(adminBtnMobile); hasMobileActions = true; } }
        else if (currentUser && currentUser.banned) { const logoutBtnMobileBanned = document.createElement('button'); logoutBtnMobileBanned.textContent = 'Logout'; logoutBtnMobileBanned.className = 'mobile-action-button mobile-logout-button'; logoutBtnMobileBanned.onclick = logoutAndRedirectHome; mobileBottomBar.appendChild(logoutBtnMobileBanned); hasMobileActions = true; }
        else { const loginBtnMobile = document.createElement('button'); loginBtnMobile.innerHTML = `<img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_white_RGB.png" alt="Discord" style="width:16px; height:16px; margin-right:5px;"> Login`; loginBtnMobile.className = 'mobile-action-button mobile-login-button'; loginBtnMobile.onclick = redirectToDiscordLogin; mobileBottomBar.appendChild(loginBtnMobile); hasMobileActions = true; }
        const homeScreen = document.getElementById('homeScreen'), homeScreenActive = homeScreen ? homeScreen.style.display === 'block' : false;
        mobileBottomBar.style.display = (isMobileView() && homeScreenActive && hasMobileActions) ? 'flex' : 'none';
    }
}

function redirectToDiscordLogin() { window.location.href = '/login'; }
function logout() { window.location.href = '/logout'; }

function fetchValues() {
    if (isDataLoaded) return Promise.resolve(valueList);
    if (dataFetchPromise) return dataFetchPromise; // Return existing promise if fetch is in progress

    toggleLoadingIndicator(true);

    dataFetchPromise = fetch('/get_all_values')
        .then(response => {
            if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason || "Your account has been restricted."); return Promise.reject(new Error("Banned user")); });
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            return response.json();
        })
        .then(data => {
            valueList = data;
            isDataLoaded = true;
            // These functions depend on valueList, so they are called after fetch
            renderBeequipSelectionGrid();
            prepareTradeOfferSelectableItems();
            const adminPanel = document.getElementById('adminPanelContainer');
            const manageItemsTab = document.getElementById('AdminManageItems');
            if (adminPanel && (adminPanel.style.display === 'block' || adminPanel.style.display === 'flex') && manageItemsTab && manageItemsTab.style.display === 'block') {
                populateAdminManageItemsTab();
            }
            console.log("Value list data fetched and processed.");
            return valueList;
        })
        .catch(error => {
            if (error.message !== "Banned user") {
                console.error('Error fetching values:', error);
                const adminItemsListContainer = document.getElementById('adminAllItemsList');
                if (adminItemsListContainer) adminItemsListContainer.innerHTML = '<p style="color: red;">Error fetching values. Check console.</p>';
            }
            isDataLoaded = false; // Reset state on error
            return Promise.reject(error); // Propagate the error for further handling
        })
        .finally(() => {
            toggleLoadingIndicator(false);
            dataFetchPromise = null; // Reset promise handler after completion
        });

    return dataFetchPromise;
}

function updateValueListUI() {
    const stickerValueItems = document.querySelectorAll('#stickerValueListContent .value-item');
    stickerValueItems.forEach(itemElement => {
        const itemName = itemElement.querySelector('span').textContent; const itemData = valueList[itemName];
        if (itemData) {
            itemElement.setAttribute('data-value-min', itemData.value_min); itemElement.setAttribute('data-value-max', itemData.value_max);
            let valueDisplay = itemElement.querySelector('.value-display'); if (!valueDisplay) { valueDisplay = document.createElement('div'); valueDisplay.className = 'value-display'; itemElement.appendChild(valueDisplay); }
            // FIX: Use innerHTML to render potential cub icons
            valueDisplay.innerHTML = formatValueDisplay(itemData.value_min, itemData.value_max, itemData.graph_value);
            const imgElement = itemElement.querySelector('img'); if (imgElement && itemData.image) { imgElement.src = itemData.image; imgElement.onerror = function() { this.src = 'https://via.placeholder.com/50?text=' + encodeURIComponent(itemName[0] || '?'); }; }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // --- Initialization ---
    initializeBeequipCustomizationModal();
    checkLoginStatus();
    fetchActiveGiveaway();

    // --- Popups and Modals ---
    discordPopup = document.getElementById('discord-join-popup');
    closeDiscordPopupBtn = document.getElementById('close-discord-popup');
    if (closeDiscordPopupBtn) closeDiscordPopupBtn.addEventListener('click', closeDiscordPopup);
    
    const auctionOutcomeModal = document.getElementById('auctionOutcomeModal');
    if (auctionOutcomeModal) {
        const closeBtn = auctionOutcomeModal.querySelector('.close');
        if (closeBtn) closeBtn.onclick = closeAuctionOutcomeModal;
        auctionOutcomeModal.onclick = (event) => {
            if (event.target == auctionOutcomeModal) closeAuctionOutcomeModal();
        };
    }

    // --- UI Toggles and Basic Navigation ---
    const desktopAdminToggle = document.getElementById('adminPanelToggle');
    if (desktopAdminToggle) desktopAdminToggle.addEventListener('click', toggleAdminPanel);

    const homeScreen = document.getElementById("homeScreen");
    if (homeScreen) homeScreen.style.display = "block";

    const firstTabButton = document.querySelector('.tab .tab-buttons-wrapper .tablinks');
    if (firstTabButton) firstTabButton.classList.add('active');

    const darkModeToggle = document.getElementById("darkModeToggle");
    if(darkModeToggle) darkModeToggle.addEventListener("click", toggleDarkMode);
    
    document.querySelectorAll('.feature-item').forEach(item => {
        item.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            if (tabName) softRedirect(tabName);
        });
    });
    
    // --- Search Bars ---
    const searchBar = document.getElementById('searchBar'); // Sticker search
    if (searchBar) searchBar.addEventListener('input', search);

    // NEW: Global Beequip Search
    const globalBeequipSearchBar = document.getElementById('globalBeequipSearchBar');
    if (globalBeequipSearchBar) {
        globalBeequipSearchBar.addEventListener('input', handleGlobalBeequipSearch);
    }

    // UPDATED: Contextual Beequip Search
    const beequipSearchBar = document.getElementById('beequipSearchBar');
    if (beequipSearchBar) {
        beequipSearchBar.addEventListener('input', handleContextualBeequipSearch);
    }
    
    // --- Beequip Value List Listeners ---
    const beequipSortSelect = document.getElementById('beequipSortBy');
    if (beequipSortSelect) {
        beequipSortSelect.addEventListener('change', (e) => {
            currentBeequipSortCriteria = e.target.value;
            const variantView = document.getElementById('beequipVariantView');
            if (currentBeequipGroupKey && variantView && variantView.style.display === 'block') {
                 renderBeequipVariantList(currentBeequipGroupKey);
            }
        });
    }
    
    const backToBeequipsBtn = document.getElementById('backToBeequipSelectionBtn');
    if (backToBeequipsBtn) backToBeequipsBtn.addEventListener('click', handleBeequipBackNavigation);

    // --- Chat Listeners ---
    const chatLauncher = document.getElementById('chatLauncher');
    if (chatLauncher) chatLauncher.addEventListener('click', toggleChatPanel);
    
    const chatContactSearch = document.getElementById('chatContactSearch');
    if(chatContactSearch) chatContactSearch.addEventListener('input', () => {
        clearTimeout(chatSearchTimeout);
        chatSearchTimeout = setTimeout(handleChatContactSearch, 300);
    });

    // --- Trade Offer Creator Listeners ---
    const btnAddYour = document.getElementById('btn-add-your');
    const btnAddTheir = document.getElementById('btn-add-their');
    const tradeOfferModal = document.getElementById('tradeOfferItemSelectionModal');
    const tradeOfferCloseBtn = document.getElementById('tradeOfferItemSelectionCloseBtn');
    const tradeOfferConfirmBtn = document.getElementById('tradeOfferItemSelectionConfirmBtn');
    const tradeOfferOverlay = document.getElementById('tradeOfferItemSelectionOverlay');
    const tradeOfferSearchInput = document.getElementById('tradeOfferItemSearch');
    
    if (btnAddYour) btnAddYour.addEventListener('click', () => openTradeOfferItemSelection('your'));
    if (btnAddTheir) btnAddTheir.addEventListener('click', () => openTradeOfferItemSelection('their'));
    if (tradeOfferCloseBtn) tradeOfferCloseBtn.addEventListener('click', closeTradeOfferItemSelection);
    if (tradeOfferOverlay) tradeOfferOverlay.addEventListener('click', closeTradeOfferItemSelection);
    if (tradeOfferConfirmBtn) tradeOfferConfirmBtn.addEventListener('click', confirmTradeOfferItemSelection);
    if (tradeOfferSearchInput) tradeOfferSearchInput.addEventListener('input', filterTradeOfferItems);
    
    document.querySelectorAll('#tradeOfferItemCategorySelection .category-btn').forEach(button => {
        button.addEventListener('click', () => {
            tradeOfferActiveCategory = button.dataset.category;
            document.querySelectorAll('#tradeOfferItemCategorySelection .category-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            if (tradeOfferSearchInput) tradeOfferSearchInput.value = '';
            tradeOfferSelectedItem = null;
            tradeOfferSelectedBeequipGroupKey = null;
            tradeOfferSelectedStickerGroupKey = null;
            filterTradeOfferItems();
        });
    });
    
    const btnOpenSaveModal = document.getElementById('btnOpenSaveOfferModal');
    const btnOpenLoadModal = document.getElementById('btnOpenLoadOfferModal');
    const btnClearOffer = document.getElementById('btnClearTradeOffer');
    const closeSaveLoadModalBtn = document.getElementById('closeTradeOfferSaveLoadModal');
    if(btnOpenSaveModal) btnOpenSaveModal.addEventListener('click', () => openTradeOfferSaveLoadModal('save'));
    if(btnOpenLoadModal) btnOpenLoadModal.addEventListener('click', () => openTradeOfferSaveLoadModal('load'));
    if(btnClearOffer) btnClearOffer.addEventListener('click', clearCurrentTradeOffer);
    if(closeSaveLoadModalBtn) closeSaveLoadModalBtn.addEventListener('click', closeTradeOfferSaveLoadModal);
    
    // --- Footer and Global Listeners ---
    const currentYearSpan = document.getElementById('currentYearFooter');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
    
    const footer = document.querySelector('.footer-container');
    if (footer) {
        const homeTab = document.getElementById('homeScreen');
        if (homeTab && homeTab.style.display === 'block') {
            footer.style.display = 'block';
        } else {
            footer.style.display = 'none';
        }
    }
    
    window.addEventListener('keydown', function(event) {
        const saveLoadModal = document.getElementById('tradeOfferSaveLoadModal');
        if (event.key === 'Escape' && saveLoadModal && saveLoadModal.style.display === 'block') {
            closeTradeOfferSaveLoadModal();
        }
    });
});

let priceChartInstance = null;

function createPriceChart(itemName) {
    if (priceChartInstance) priceChartInstance.destroy();

    fetch(`/values/${itemName}`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('priceChart');
            if (!ctx) return;

            const hasPriceData = data.prices && data.prices.length > 0;
            const hasDemandData = data.demand_prices && data.demand_prices.length > 0;

            if (!hasPriceData && !hasDemandData) {
                ctx.style.display = 'none';
                console.warn("No price or demand data for chart or canvas not found for:", itemName);
                return;
            }
            
            ctx.style.display = 'block';

            let datasets = [];
            const isDarkMode = document.body.classList.contains('dark-mode');
            const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const ticksColor = isDarkMode ? '#ccc' : '#666';

            let scales = {
                x: {
                    type: 'time',
                    time: { unit: 'day' },
                    grid: { color: gridColor },
                    ticks: { color: ticksColor }
                }
            };

            if (hasPriceData) {
                datasets.push({
                    label: 'Avg. Value (Signs)',
                    data: data.prices,
                    borderColor: 'rgb(52, 152, 219)',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.1,
                    yAxisID: 'y_value'
                });
                scales.y_value = {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Value (Signs)',
                        color: 'rgb(52, 152, 219)'
                    },
                    grid: { color: gridColor },
                    ticks: { color: 'rgb(52, 152, 219)' }
                };
            }

            if (hasDemandData) {
                datasets.push({
                    label: 'Demand (0-5)',
                    data: data.demand_prices,
                    borderColor: 'rgb(230, 126, 34)',
                    backgroundColor: 'rgba(230, 126, 34, 0.2)',
                    tension: 0.1,
                    yAxisID: 'y_demand'
                });
                scales.y_demand = {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: 5,
                    title: {
                        display: true,
                        text: 'Demand',
                        color: 'rgb(230, 126, 34)'
                    },
                    grid: { drawOnChartArea: false },
                    ticks: { color: 'rgb(230, 126, 34)', stepSize: 1 }
                };
            }
            
            const chartOptions = {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: scales,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    if (context.dataset.yAxisID === 'y_demand') {
                                        label += context.parsed.y.toFixed(1);
                                    } else {
                                        label += `${context.parsed.y.toFixed(2)} Signs`;
                                    }
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        labels: {
                            color: ticksColor
                        }
                    }
                },
                // onClick handler for admin actions
                onClick: (event, elements, chart) => {
                    if (currentUser && currentUser.is_admin) {
                         const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
                         if (points.length) {
                             showChartContextMenu(event, chart, points);
                         }
                    }
                },
                onHover: (event, chartElement, chart) => {
                    if (currentUser && currentUser.is_admin) {
                        const canvas = chart.canvas;
                        canvas.style.cursor = chartElement[0] ? 'pointer' : 'default';
                    }
                }
            };
            
            priceChartInstance = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: { datasets: datasets },
                options: chartOptions
            });
        })
        .catch(error => console.error('Error fetching price chart data:', error));
}

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.querySelectorAll(".tab .tab-buttons-wrapper .tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    const tabElement = document.getElementById(tabName);
    if (tabElement) {
        tabElement.style.display = "block";

        // --- START: GOOGLE ANALYTICS SPA TRACKING ---
        // This sends a "page_view" event to Google Analytics whenever a tab is opened.
        if (typeof gtag === 'function') {
            gtag('event', 'page_view', {
                page_title: tabName,
                page_location: window.location.origin + '/' + tabName,
                page_path: '/' + tabName
            });
        }

        if (tabName === 'ValueList' && !isDataLoaded) {
            fetchValues().then(() => {
                showValueListSelectionScreen();
                 // Auto-open first subtab if it's the sticker list to show content
                const firstStickerTabButton = document.querySelector('#stickerValueListContent .subtablinks');
                if (firstStickerTabButton && !document.querySelector('#stickerValueListContent .subtablinks.active')) {
                   // This part is tricky, because openSubTab requires an event. We can simulate it.
                   // Or better, just ensure the first subtab's content is generated if the user clicks it.
                }
            }).catch(err => {
                console.error("Failed to load value list data:", err);
                tabElement.innerHTML = '<p style="color: red; text-align: center; padding: 2rem;">Could not load item data. Please try again later.</p>';
            });
        } else if (tabName === 'ValueList') {
            showValueListSelectionScreen();
        }

        // --- FIX IS HERE ---
        if (tabName === 'TradeOfferCreator') {
            if (!isDataLoaded) {
                fetchValues().catch(err => {
                    console.error("Failed to load data for Trade Offer Creator:", err);
                });
            }
            renderTradeOfferItems();
        } else if (tabName === 'LFG') {
            // Do nothing, it's a blank page
        }
    } else {
        console.error(`Tab content with ID '${tabName}' not found`);
        updateUserProfileAndMobileActions();
        return;
    }

    if (evt && evt.currentTarget) {
        evt.currentTarget.className += " active";
    } else {
        for (i = 0; i < tablinks.length; i++) {
            if (tablinks[i].getAttribute('onclick') && tablinks[i].getAttribute('onclick').includes(`'${tabName}'`)) {
                tablinks[i].className += " active";
                break;
            }
        }
    }

    const footer = document.querySelector('.footer-container');
    if (footer) footer.style.display = (tabName === 'homeScreen') ? 'block' : 'none';

    if (tabName === 'OnlineMarket') {
        const marketContent = document.getElementById('marketContent'),
            marketLoginPrompt = document.getElementById('marketLoginPrompt');
        if (currentUser && !currentUser.banned) {
            if (marketContent) marketContent.style.display = 'block';
            if (marketLoginPrompt) marketLoginPrompt.style.display = 'none';
            setTimeout(() => {
                const defaultTab = document.getElementById('defaultMarketTab');
                if (defaultTab && !document.querySelector("#OnlineMarket .subtablinks.active")) {
                    defaultTab.click();
                }
            }, 0);
        } else {
            if (marketContent) marketContent.style.display = 'none';
            if (marketLoginPrompt) marketLoginPrompt.style.display = 'block';
        }
    }
    updateUserProfileAndMobileActions();
}

function openSubTab(evt, subTabName) {
    var i, subtabcontent, subtablinks_elements;
    const currentMainTab = evt.target.closest('.tabcontent');
    if (!currentMainTab) return;

    subtabcontent = currentMainTab.getElementsByClassName("subtabcontent");
    for (i = 0; i < subtabcontent.length; i++) {
        subtabcontent[i].style.display = "none";
    }

    subtablinks_elements = currentMainTab.getElementsByClassName("subtablinks");
    for (i = 0; i < subtablinks_elements.length; i++) {
        subtablinks_elements[i].className = subtablinks_elements[i].className.replace(" active", "");
    }

    const subTabElement = currentMainTab.querySelector(`#${subTabName}`);
    if(subTabElement) {
        subTabElement.style.display = "block";
        // NEW: Check if content has been generated. If not, generate it.
        if (!subTabElement.dataset.generated) {
            generateStickerListForSubtab(subTabName);
            subTabElement.dataset.generated = "true";
        }
    } else {
        console.error("Subtab not found:", subTabName);
    }
    evt.currentTarget.className += " active";
}

function openModal(itemName) {
    currentOpenModalItemName = itemName;
    var modal = document.getElementById("itemModal");
    var modalContent = modal.querySelector(".modal-content");
    const itemData = valueList[itemName] || {};
    const { value_min: valueMin, value_max: valueMax, graph_value: graphValue, demand, acronyms } = itemData;

    const image = itemData.image || 'https://via.placeholder.com/80?text=No+Img';

    let demandHtml = '';
    if (demand !== null && typeof demand !== 'undefined') {
        demandHtml = `<p>Demand: <strong>${escapeHTML(String(demand))}/5</strong></p>`;
    }

    modalContent.innerHTML = `
        <span class="close" onclick="closeItemModal()">×</span>
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
            <img src="${escapeHTML(image)}" alt="${escapeHTML(itemName)}" style="max-width: 80px; max-height: 80px; margin-right: 15px; border-radius: 5px; object-fit: contain;" onerror="this.src='https://via.placeholder.com/80x80.png?text=?';">
            <h2 id="modalTitle">${escapeHTML(itemName)}</h2>
        </div>
        <p>Current Value: <strong><span id="modalCurrentValueDisplay"></span></strong></p>
        ${demandHtml}
        <p>Category: ${escapeHTML(itemData.category) || 'Sticker'}</p>
        <canvas id="priceChart"></canvas>
    `;

    const valueDisplaySpan = modalContent.querySelector("#modalCurrentValueDisplay");
    if (valueDisplaySpan) {
        valueDisplaySpan.innerHTML = formatValueDisplay(valueMin, valueMax, graphValue, true);
    }

    if (currentUser && currentUser.is_admin) {
        const adminControls = document.createElement('div');
        adminControls.className = 'admin-edit-controls';
        const adminEditImageUrl = itemData.image || '';
        const adminDemandValue = demand !== null && typeof demand !== 'undefined' ? demand : '';
        adminControls.innerHTML = `<h4>Admin Edit</h4><div class="form-group"><label for="adminEditValueMin">Min Value:</label><input type="text" id="adminEditValueMin" value="${valueMin !== null ? valueMin : ''}" placeholder="Enter min value"></div><div class="form-group"><label for="adminEditValueMax">Max Value:</label><input type="text" id="adminEditValueMax" value="${valueMax !== null ? valueMax : ''}" placeholder="Enter max value"></div><div class="form-group"><label for="adminEditDemand">Demand (0-5):</label><input type="number" id="adminEditDemand" value="${adminDemandValue}" placeholder="e.g., 2.5" step="0.1" min="0" max="5"></div><div class="form-group"><label for="adminEditAcronyms">Acronyms:</label><input type="text" id="adminEditAcronyms" value="${escapeHTML(acronyms || '')}" placeholder="comma,separated,list"></div><div class="form-group"><label for="adminEditImage">New Image URL (optional):</label><input type="text" id="adminEditImage" value="${escapeHTML(adminEditImageUrl)}" placeholder="Enter new image URL (leave blank to inherit from group if applicable)"></div><button onclick="saveItemValue('${escapeHTML(itemName)}', true)" class="admin-save-button">Save Changes</button><button onclick="deleteItemFromModal('${escapeHTML(itemName)}')" class="admin-delete-button" style="margin-left: 10px;">Delete Item</button><div id="adminEditMessage" class="message-box"></div>`;
        modalContent.appendChild(adminControls);
    }
    
    modal.style.display = "block";
    
    if (!itemData.category || !itemData.category.toLowerCase().includes('group')) {
        createPriceChart(itemName);
    } else {
        const chartCanvas = document.getElementById('priceChart');
        if(chartCanvas) chartCanvas.style.display = 'none';
    }
}

function adminRenameItemPrompt(oldItemKey) {
    if (!currentUser || !currentUser.is_admin) {
        alert("Unauthorized access.");
        return;
    }
    const newItemKey = prompt(`Enter the new name for "${escapeHTML(oldItemKey)}":`, oldItemKey);

    if (newItemKey === null || newItemKey.trim() === '' || newItemKey.trim() === oldItemKey) {
        if (newItemKey !== null) {
            alert("Rename cancelled or name not changed.");
        }
        return;
    }

    const messageBox = document.getElementById('adminEditMessage');
    if(messageBox) {
        messageBox.textContent = 'Renaming item and updating references...';
        messageBox.style.color = '#3498db';
    }
    toggleLoadingIndicator(true);

    fetch('/api/admin/item/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ old_key: oldItemKey, new_key: newItemKey.trim() }),
        credentials: 'include'
    })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {
        if (status === 200) {
            alert(body.message || "Item renamed successfully!");
            closeItemModal();
            fetchValues();
        } else {
            const errorMsg = `Error renaming: ${body.error || 'Unknown error'}`;
            alert(errorMsg);
            if(messageBox) {
                messageBox.textContent = errorMsg;
                messageBox.style.color = 'red';
            }
        }
    })
    .catch(error => {
        console.error('Error during rename fetch:', error);
        const errorMsg = 'An error occurred during the rename request.';
        alert(errorMsg);
        if(messageBox) {
            messageBox.textContent = errorMsg;
            messageBox.style.color = 'red';
        }
    })
    .finally(() => {
        toggleLoadingIndicator(false);
    });
}

function closeItemModal() { const modal = document.getElementById('itemModal'); if (modal) modal.style.display = 'none'; if (priceChartInstance) { priceChartInstance.destroy(); priceChartInstance = null; } currentOpenModalItemName = null; }

window.onclick = function(event) {
    var itemModal = document.getElementById("itemModal"); if (event.target == itemModal) closeItemModal();
    var bidModal = document.getElementById("bidModal"); if (event.target == bidModal) closeBidModal();
    var listingModal = document.getElementById("listingModal"); if (event.target == listingModal) closeListingModal();
    var imageZoomModal = document.getElementById("imageZoomModal"); if (event.target == imageZoomModal) closeImageModal();
    var reportModal = document.getElementById("reportModal"); if (event.target == reportModal) closeReportModal();
    var auctionOutcomeModal = document.getElementById("auctionOutcomeModal"); if (event.target == auctionOutcomeModal) closeAuctionOutcomeModal();
    
    if (discordPopup && event.target == discordPopup) closeDiscordPopup();

    const chatPanel = document.getElementById('chatPanel'), chatLauncher = document.getElementById('chatLauncher');
    if (chatPanel && chatPanel.style.display === 'flex' && event.target !== chatPanel && !chatPanel.contains(event.target) && event.target !== chatLauncher && !chatLauncher.contains(event.target)) toggleChatPanel(false);
    const tradeOfferModal = document.getElementById('tradeOfferItemSelectionModal');
    if (event.target && event.target.id === 'tradeOfferItemSelectionOverlay' && tradeOfferModal && tradeOfferModal.style.display === 'block') closeTradeOfferItemSelection();
}

function setColorScheme() {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)'), savedMode = localStorage.getItem('colorScheme');
    if (savedMode === 'light') document.body.classList.remove('dark-mode'); else if (savedMode === 'dark' || darkModeMediaQuery.matches || !savedMode) document.body.classList.add('dark-mode');
    const robloxModal = document.getElementById('robloxVerificationModal'), robloxOverlay = document.getElementById('robloxVerificationOverlay');
    if (robloxModal && robloxOverlay && robloxOverlay.style.display === 'flex') { if (document.body.classList.contains('dark-mode')) { robloxModal.style.backgroundColor = 'var(--dark-modal-content)'; robloxModal.style.color = 'var(--dark-text-color)'; } else { robloxModal.style.backgroundColor = 'var(--modal-content)'; robloxModal.style.color = 'var(--text-color)'; } }
}
document.addEventListener('DOMContentLoaded', setColorScheme);
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setColorScheme);
function toggleDarkMode() { document.body.classList.toggle('dark-mode'); localStorage.setItem('colorScheme', document.body.classList.contains('dark-mode') ? 'dark' : 'light'); setColorScheme(); }
function softRedirect(tabName) { window.scrollTo({top: 0, behavior: 'smooth'}); setTimeout(() => { openTab(null, tabName); }, 50); }

function search() {
    const searchTerm = document.getElementById('searchBar').value.toLowerCase().trim(), searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = ''; if (searchTerm.length === 0) return;
    const searchableItems = []; Object.keys(valueList).forEach(itemName => { if (valueList[itemName].category && valueList[itemName].category.toLowerCase().includes('sticker') || !valueList[itemName].category) searchableItems.push({ name: itemName, value_min: valueList[itemName].value_min, value_max: valueList[itemName].value_max, graph_value: valueList[itemName].graph_value, acronyms: valueList[itemName].acronyms || '' }); });
    const stickerValueItems = document.querySelectorAll('#stickerValueListContent .value-item'), stickerItemMap = {}; stickerValueItems.forEach(item => { stickerItemMap[item.querySelector('span').textContent] = item; });
    const fuseOptions = { keys: ['name', 'acronyms'], threshold: 0.3, distance: 50, minMatchCharLength: 3 }, fuse = new Fuse(searchableItems, fuseOptions);
    const fuseResults = fuse.search(searchTerm); const maxDistance = Math.min(Math.floor(searchTerm.length / 3), 3);
    const levenshteinResults = searchableItems.filter(item => { const itemNameLower = item.name.toLowerCase(); if (Math.abs(itemNameLower.length - searchTerm.length) > maxDistance) return false; return levenshteinDistance(itemNameLower, searchTerm) <= maxDistance; });
    const combinedResults = new Set([...fuseResults.map(r => r.item), ...levenshteinResults]);
    if (combinedResults.size > 0) {
        const categoryDiv = document.createElement('div'); categoryDiv.className = 'search-category'; categoryDiv.innerHTML = '<h4>Search Results (Stickers)</h4>';
        combinedResults.forEach(item => {
            const originalItemElement = stickerItemMap[item.name];
            if (originalItemElement) {
                const resultItem = originalItemElement.cloneNode(true); resultItem.className = 'value-item search-item';
                const valueDisplay = resultItem.querySelector('.value-display');
                // FIX: Use innerHTML for search results
                if (valueDisplay) valueDisplay.innerHTML = formatValueDisplay(item.value_min, item.value_max, item.graph_value);
                resultItem.onclick = () => { openModal(item.name); searchResults.innerHTML = ''; document.getElementById('searchBar').value = ''; }; categoryDiv.appendChild(resultItem);
            }
        });
        searchResults.appendChild(categoryDiv);
    }
}

function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length; if (b.length === 0) return a.length; const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i]; for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) for (let j = 1; j <= a.length; j++) matrix[i][j] = (b.charAt(i - 1) === a.charAt(j - 1)) ? matrix[i - 1][j - 1] : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    return matrix[b.length][a.length];
}

function openMarketTab(evt, tabName) {
    var i, tabcontent, tablinks; const marketTabContainer = document.getElementById('OnlineMarket'); if (!marketTabContainer) return;
    tabcontent = marketTabContainer.getElementsByClassName("market-tabcontent"); for (i = 0; i < tabcontent.length; i++) tabcontent[i].style.display = "none";
    tablinks = marketTabContainer.querySelectorAll(".subtablinks"); for (i = 0; i < tablinks.length; i++) tablinks[i].className = tablinks[i].className.replace(" active", "");
    const tabElement = marketTabContainer.querySelector(`#${tabName}`); if(tabElement) tabElement.style.display = "block"; evt.currentTarget.className += " active";
    if (tabName === 'BrowseListings') { if (Object.keys(currentListings).length > 0) renderFilteredAndSortedListings(); else refreshListings(); }
    else if (tabName === 'Auctions') { if (Object.keys(currentAuctions).length > 0 && Object.values(currentAuctions).some(a => a.status === 'active')) renderFilteredAndSortedAuctions(); else refreshAuctions(); }
    else if (tabName === 'PrivateServers') refreshServers(); else if (tabName === 'MyListings') loadMyListings();
}

function toggleAdminPanel() {
    const panel = document.getElementById('adminPanelContainer'); if (!panel) return;
    if (panel.style.display === 'block' || panel.style.display === 'flex') panel.style.display = 'none';
    else { panel.style.display = isMobileView() ? 'flex' : 'block'; const defaultAdminTab = panel.querySelector('.admin-tab-btn'), activeAdminTab = panel.querySelector('.admin-tab-btn.active'); if (defaultAdminTab && !activeAdminTab) openAdminPanelTab({currentTarget: defaultAdminTab}, defaultAdminTab.dataset.tab); else if (activeAdminTab) openAdminPanelTab({currentTarget: activeAdminTab}, activeAdminTab.dataset.tab); }
}

function closeAdminPanel() { const panel = document.getElementById('adminPanelContainer'); if (panel) panel.style.display = 'none'; }

function openAdminPanelTab(evt, tabName) {
    var i, tabcontent, tablinks; const adminPanel = document.getElementById('adminPanelContainer'); if (!adminPanel) return;
    tabcontent = adminPanel.getElementsByClassName("admin-panel-tabcontent"); for (i = 0; i < tabcontent.length; i++) tabcontent[i].style.display = "none";
    tablinks = adminPanel.getElementsByClassName("admin-tab-btn"); for (i = 0; i < tablinks.length; i++) tablinks[i].className = tablinks[i].className.replace(" active", "");
    const tabElement = adminPanel.querySelector(`#${tabName}`); if(tabElement) tabElement.style.display = "block"; evt.currentTarget.className += " active";
    if (tabName === 'AdminManageItems') {
        populateAdminManageItemsTab();
    } else if (tabName === 'AdminManageMarketServers') {
        refreshAdminServers();
    } else if (tabName === 'AdminViewReports') {
        refreshReports();
    } else if (tabName === 'AdminViewLogs') {
        populateAdminLogsTab();
    } else if (tabName === 'AdminManageGiveaways') {
        populateAdminGiveawaysTab();
    } else if (tabName === 'AdminViewBans') { // New tab check
        populateAdminBansTab();
    }
}

function populateAdminBansTab() {
    const container = document.getElementById('adminBansList');
    if (!container) return;
    toggleLoadingIndicator(true);
    container.innerHTML = 'Loading banned users...';

    fetch('/api/admin/bans', { credentials: 'include' })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => { throw new Error(data.error || `HTTP error ${response.status}`) });
            }
            return response.json();
        })
        .then(bans => {
            if (bans.error) {
                container.innerHTML = `<p style="color:red;">Error: ${escapeHTML(bans.error)}</p>`;
                return;
            }
            if (!bans || bans.length === 0) {
                container.innerHTML = '<p>No users are currently banned.</p>';
                return;
            }
            let html = `<div class="table-responsive-wrapper"><table class="admin-items-list"><thead><tr><th>Identifier</th><th>Type</th><th>Reason</th><th>Banned By</th><th>Timestamp (UTC)</th><th>Actions</th></tr></thead><tbody>`;
            bans.forEach(b => {
                const identifier = escapeHTML(b.identifier);
                const idType = escapeHTML(b.ban_type);
                const reason = escapeHTML(b.reason || 'N/A');
                const admin = escapeHTML(b.admin_username || 'Unknown');
                const adminId = escapeHTML(b.admin_id || 'N/A');
                const timestamp = b.timestamp ? formatDate(b.timestamp, true) : 'N/A';
                // The single quotes around string parameters are important for the onclick handler
                const unbanAction = `adminUnbanUserFromTable(${b.id}, '${identifier}', '${idType}')`;

                html += `<tr id="ban-row-${b.id}">
                    <td>${identifier}</td>
                    <td>${idType}</td>
                    <td>${reason}</td>
                    <td>${admin} (${adminId})</td>
                    <td>${timestamp}</td>
                    <td>
                        <button class="admin-action-button" style="background-color: var(--secondary-color);" onclick="${unbanAction}">Unban</button>
                    </td>
                </tr>`;
            });
            html += '</tbody></table></div>';
            container.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching admin bans:', error);
            container.innerHTML = `<p style="color:red;">Failed to load bans list: ${escapeHTML(error.message)}</p>`;
        })
        .finally(() => toggleLoadingIndicator(false));
}

async function adminUnbanUserFromTable(banId, identifier, idType) {
    if (!currentUser || (!currentUser.is_admin && !currentUser.is_moderator)) {
        alert('Admins/Mods only');
        return;
    }
    if (!confirm(`Are you sure you want to unban this user?\nIdentifier: ${identifier}\nType: ${idType}`)) {
        return;
    }
    
    toggleLoadingIndicator(true);
    try {
        const response = await fetch('/api/admin/unban', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, id_type: idType, admin_discord_id: currentUser.discord_id }),
            credentials: 'include'
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || `HTTP Error ${response.status}`);
        }
        alert(data.message || 'User unbanned successfully.');
        // Remove the row from the table
        const row = document.getElementById(`ban-row-${banId}`);
        if (row) {
            row.style.transition = 'opacity 0.5s ease';
            row.style.opacity = '0';
            setTimeout(() => row.remove(), 500);
        }
    } catch (error) {
        console.error('Error unbanning user from table:', error);
        alert(`Failed to unban user: ${error.message}`);
    } finally {
        toggleLoadingIndicator(false);
    }
}

async function fetchActiveGiveaway() {
    try {
        const response = await fetch('/api/giveaway/active');
        if (!response.ok) {
            console.warn('Could not fetch active giveaway info.');
            return;
        }
        const giveawayData = await response.json();
        
        if (giveawayData && giveawayData.id) {
            const seenGiveawayId = sessionStorage.getItem('seenGiveawayId');
            if (seenGiveawayId !== giveawayData.id) {
                showGiveawayPopup(giveawayData);
            }
        }
    } catch (error) {
        console.error('Error fetching active giveaway:', error);
    }
}

function showGiveawayPopup(data) {
    const popup = document.getElementById('giveaway-popup');
    const titleEl = document.getElementById('giveaway-popup-title');
    const descEl = document.getElementById('giveaway-popup-description');
    const imageEl = document.getElementById('giveaway-popup-image');
    const linkEl = document.getElementById('giveaway-popup-link');

    if (!popup || !titleEl || !descEl || !imageEl || !linkEl) {
        console.error("Giveaway popup elements are missing from the DOM.");
        return;
    }

    titleEl.textContent = escapeHTML(data.title);
    descEl.textContent = escapeHTML(data.description);
    linkEl.href = data.discord_link;

    if (data.image_url) {
        imageEl.src = escapeHTML(data.image_url);
        imageEl.style.display = 'block';
    } else {
        imageEl.style.display = 'none';
    }

    popup.style.display = 'flex';
    popup.dataset.giveawayId = data.id; // Store ID for closing
}

function closeGiveawayPopup() {
    const popup = document.getElementById('giveaway-popup');
    if (popup) {
        popup.style.display = 'none';
        const giveawayId = popup.dataset.giveawayId;
        if (giveawayId) {
            sessionStorage.setItem('seenGiveawayId', giveawayId);
        }
    }
}

function populateAdminGiveawaysTab() {
    const container = document.getElementById('adminGiveawaysList');
    if (!container) return;
    toggleLoadingIndicator(true);
    container.innerHTML = 'Loading giveaways...';

    fetch('/api/admin/giveaways', { credentials: 'include' })
        .then(response => response.json())
        .then(giveaways => {
            if (giveaways.error) {
                container.innerHTML = `<p style="color:red;">Error: ${escapeHTML(giveaways.error)}</p>`;
                return;
            }
            if (!giveaways || giveaways.length === 0) {
                container.innerHTML = '<p>No giveaways found.</p>';
                return;
            }
            let html = `<div class="table-responsive-wrapper"><table class="admin-items-list"><thead><tr><th>Status</th><th>Title</th><th>Ends At (UTC)</th><th>Link</th><th>Actions</th></tr></thead><tbody>`;
            giveaways.forEach(g => {
                const isActive = g.is_active && new Date(g.end_time) > new Date();
                html += `<tr>
                    <td><span style="color: ${isActive ? 'green' : 'red'}; font-weight: bold;">${isActive ? 'Active' : 'Inactive'}</span></td>
                    <td>${escapeHTML(g.title)}</td>
                    <td>${escapeHTML(new Date(g.end_time).toLocaleString('en-GB', { timeZone: 'UTC' }))}</td>
                    <td><a href="${escapeHTML(g.discord_link)}" target="_blank">Link</a></td>
                    <td>
                        ${isActive ? `<button class="admin-delete-button" onclick="adminDeactivateGiveaway('${escapeHTML(g.id)}')">Deactivate</button>` : ''}
                    </td>
                </tr>`;
            });
            html += '</tbody></table></div>';
            container.innerHTML = html;
        })
        .catch(error => {
            console.error('Error fetching admin giveaways:', error);
            container.innerHTML = '<p style="color:red;">Failed to load giveaways.</p>';
        })
        .finally(() => toggleLoadingIndicator(false));
}

function adminCreateGiveaway() {
    if (!currentUser || !currentUser.is_admin) {
        alert('Admin privileges required.');
        return;
    }

    const title = document.getElementById('newGiveawayTitle').value.trim();
    const description = document.getElementById('newGiveawayDescription').value.trim();
    const image_url = document.getElementById('newGiveawayImage').value.trim();
    const discord_link = document.getElementById('newGiveawayLink').value.trim();
    const duration_hours = document.getElementById('newGiveawayDuration').value;
    const messageBox = document.getElementById('createGiveawayMessage');

    if (!title || !description || !discord_link || !duration_hours) {
        messageBox.textContent = 'All fields except image are required.';
        messageBox.style.color = 'red';
        return;
    }

    messageBox.textContent = 'Creating...';
    messageBox.style.color = '#3498db';
    toggleLoadingIndicator(true);

    fetch('/api/admin/giveaways/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, image_url, discord_link, duration_hours }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            messageBox.textContent = `Error: ${escapeHTML(data.error)}`;
            messageBox.style.color = 'red';
        } else {
            messageBox.textContent = escapeHTML(data.message);
            messageBox.style.color = 'green';
            populateAdminGiveawaysTab(); // Refresh the list
            // Clear form
            document.getElementById('newGiveawayTitle').value = '';
            document.getElementById('newGiveawayDescription').value = '';
            document.getElementById('newGiveawayImage').value = '';
            document.getElementById('newGiveawayLink').value = '';
            document.getElementById('newGiveawayDuration').value = '24';
        }
    })
    .catch(error => {
        console.error('Error creating giveaway:', error);
        messageBox.textContent = 'An unexpected error occurred.';
        messageBox.style.color = 'red';
    })
    .finally(() => toggleLoadingIndicator(false));
}

function adminDeactivateGiveaway(giveawayId) {
    if (!currentUser || !currentUser.is_admin) {
        alert('Admin privileges required.');
        return;
    }
    if (!confirm('Are you sure you want to deactivate this giveaway? It will no longer appear for users.')) {
        return;
    }

    toggleLoadingIndicator(true);
    fetch(`/api/admin/giveaways/deactivate/${giveawayId}`, {
        method: 'PUT',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(`Error: ${escapeHTML(data.error)}`);
        } else {
            alert(escapeHTML(data.message));
            populateAdminGiveawaysTab(); // Refresh the list
        }
    })
    .catch(error => {
        console.error('Error deactivating giveaway:', error);
        alert('An unexpected error occurred.');
    })
    .finally(() => toggleLoadingIndicator(false));
}

function populateAdminManageItemsTab() {
    if (!isDataLoaded) {
        fetchValues().then(populateAdminManageItemsTab).catch(err => {
            const container = document.getElementById('adminBeequipDashboard');
            if (container) container.innerHTML = `<p style="color:red;">Failed to load item data. Cannot build dashboard.</p>`;
        });
        return;
    }

    const dashboard = document.getElementById('adminBeequipDashboard');
    if (!dashboard) return;

    dashboard.innerHTML = `
        <div class="admin-beequip-layout">
            <div id="adminGroupsColumn" class="admin-groups-column">
                <!-- Groups Column Content -->
            </div>
            <div id="adminVariantsColumn" class="admin-variants-column">
                <!-- Variants Column Content -->
            </div>
        </div>
    `;

    renderAdminBeequipGroupsColumn();
    renderAdminVariantsColumn(null); // Initial state for variants column
}

function renderAdminBeequipGroupsColumn() {
    const groupsColumn = document.getElementById('adminGroupsColumn');
    if (!groupsColumn) return;

    const beequipGroups = Object.values(valueList)
        .filter(item => item.category === 'Beequip Group')
        .sort((a, b) => a.key.localeCompare(b.key));

    let groupsListHtml = beequipGroups.map(group => `
        <div class="admin-beequip-group-list-item" data-group-key="${escapeHTML(group.key)}" onclick="showAdminGroupVariants('${escapeHTML(group.key)}')">
            <div class="group-info">
                <img src="${escapeHTML(group.image || 'https://via.placeholder.com/30?text=?')}" alt="" class="admin-item-image">
                <span>${escapeHTML(group.key)}</span>
            </div>
            <div class="group-actions">
                <button class="admin-edit-button" onclick="event.stopPropagation(); adminUpdateGroupImage('${escapeHTML(group.key)}')">Image</button>
                <button class="admin-delete-button" onclick="event.stopPropagation(); adminDeleteItemOrGroup('${escapeHTML(group.key)}')">Delete</button>
            </div>
        </div>
    `).join('');

    groupsColumn.innerHTML = `
        <h4 class="admin-column-header">Beequip Groups</h4>
        <div class="admin-list-container">${groupsListHtml}</div>
        <div class="admin-beequip-form">
            <h5>Add New Beequip Group</h5>
            <div class="form-group"><input type="text" id="newAdminGroupKey" placeholder="Group Name (e.g., Whistle)"></div>
            <div class="form-group"><input type="text" id="newAdminGroupImage" placeholder="Image URL (Optional)"></div>
            <button onclick="adminAddBeequipGroup()" class="admin-action-button">Add Group</button>
            <div id="adminAddGroupMessage" class="message-box"></div>
        </div>
    `;
}

function showAdminGroupVariants(groupKey) {
    // Highlight selected group
    document.querySelectorAll('.admin-beequip-group-list-item').forEach(el => {
        el.classList.remove('selected');
        if (el.dataset.groupKey === groupKey) {
            el.classList.add('selected');
        }
    });
    renderAdminVariantsColumn(groupKey);
}

function renderAdminVariantsColumn(groupKey) {
    const variantsColumn = document.getElementById('adminVariantsColumn');
    if (!variantsColumn) return;

    if (!groupKey) {
        variantsColumn.innerHTML = `<div class="placeholder"><p>Select a group from the left to manage its variants.</p></div>`;
        return;
    }

    const variants = Object.values(valueList).filter(item => item.group_ref === groupKey);
    const subgroups = {};

    variants.forEach(variant => {
        const suffix = variant.key.substring(groupKey.length).replace(/^,\s*/, '').trim();
        const subgroupName = suffix.split(',')[0].trim() || 'Base Variants';
        if (!subgroups[subgroupName]) {
            subgroups[subgroupName] = [];
        }
        subgroups[subgroupName].push(variant);
    });

    let variantsHtml = '';
    const sortedSubgroupKeys = Object.keys(subgroups).sort((a,b) => a.localeCompare(b));

    for (const subgroupName of sortedSubgroupKeys) {
        variantsHtml += `
            <div class="admin-variant-subgroup">
                <details open>
                    <summary>${escapeHTML(subgroupName)} (${subgroups[subgroupName].length})</summary>
                    <div class="admin-variant-subgroup-content">
        `;
        const sortedVariants = subgroups[subgroupName].sort((a, b) => a.key.localeCompare(b.key));
        sortedVariants.forEach(variant => {
            variantsHtml += `
                <div class="admin-variant-list-item">
                    <div class="variant-info">${escapeHTML(variant.key)}</div>
                    <div class="variant-actions">
                        <button class="admin-edit-button" onclick="openEditModalForItem('${escapeHTML(variant.key)}')">Edit</button>
                        <button class="admin-delete-button" onclick="adminDeleteItemOrGroup('${escapeHTML(variant.key)}')">Delete</button>
                    </div>
                </div>
            `;
        });
        variantsHtml += `</div></details></div>`;
    }
    
    // Create the dropdown options for existing subgroups
    const subgroupOptionsHtml = sortedSubgroupKeys.map(sg => `<option value="${escapeHTML(sg)}">${escapeHTML(sg)}</option>`).join('');

    variantsColumn.innerHTML = `
        <h4 class="admin-column-header">Variants for "${escapeHTML(groupKey)}"</h4>
        <div class="admin-list-container">${variantsHtml || '<p style="padding:10px; opacity: 0.7;">No variants found for this group yet.</p>'}</div>

        <!-- FORM 1: Create an Empty Subgroup -->
        <div class="admin-subgroup-creator">
            <h5>Create New Subgroup</h5>
            <div class="form-group">
                <input type="text" id="newAdminSubgroupNameOnly" placeholder='New Subgroup Name (e.g., "Attack Buffs")'>
            </div>
            <button onclick="adminAddEmptySubgroup('${escapeHTML(groupKey)}')" class="admin-action-button" style="background-color: var(--secondary-color);">Create Subgroup</button>
            <div id="adminAddSubgroupMessage" class="message-box"></div>
        </div>
        
        <!-- FORM 2: Add a Detailed Variant to an Existing Subgroup -->
        <div class="admin-beequip-form">
            <h5>Add New Variant to Subgroup</h5>
            <div class="form-group">
                <label for="selectAdminVariantSubgroup">Choose Subgroup:</label>
                <select id="selectAdminVariantSubgroup">
                    <option value="">-- Select a Subgroup --</option>
                    ${subgroupOptionsHtml}
                </select>
            </div>
            <div class="form-group">
                <label for="newAdminVariantDetails">Variant Details (what makes it unique):</label>
                <input type="text" id="newAdminVariantDetails" placeholder='e.g., "+5%" or "1 Star, +5%"'>
            </div>
            <div class="form-group"><input type="text" id="newAdminVariantValueMin" placeholder="Min Value (e.g., 150 or {Tide Popper})"></div>
            <div class="form-group"><input type="text" id="newAdminVariantValueMax" placeholder="Max Value (leave blank if same as Min)"></div>
            <button onclick="adminAddBeequipVariant('${escapeHTML(groupKey)}')" class="admin-action-button">Add Variant</button>
            <div id="adminAddVariantMessage" class="message-box"></div>
        </div>
    `;
}

function adminAddEmptySubgroup(groupKey) {
    const subgroupNameInput = document.getElementById('newAdminSubgroupNameOnly');
    const messageBox = document.getElementById('adminAddSubgroupMessage');
    const subgroupName = subgroupNameInput.value.trim();

    if (!subgroupName) {
        messageBox.textContent = 'Subgroup name is required.';
        messageBox.style.color = 'red';
        return;
    }

    // Creating a placeholder variant. The backend treats it like any other variant.
    const payload = {
        group_ref: groupKey,
        variant_suffix: subgroupName, // Suffix is just the subgroup name
        value_min: "0", // Default placeholder value
        value_max: "0",
        demand: null,
        image: ""
    };

    messageBox.textContent = 'Creating subgroup...'; messageBox.style.color = '#3498db'; toggleLoadingIndicator(true);
    fetch('/api/admin/beequip/variant/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            messageBox.textContent = `Error: ${escapeHTML(data.error)}`;
            messageBox.style.color = 'red';
        } else {
            messageBox.textContent = `Subgroup "${escapeHTML(subgroupName)}" created successfully.`;
            messageBox.style.color = 'green';
            subgroupNameInput.value = '';
            fetchValues().then(() => renderAdminVariantsColumn(groupKey)); // Refresh UI
        }
    })
    .catch(err => {
        messageBox.textContent = 'A network error occurred.';
        messageBox.style.color = 'red';
    })
    .finally(() => toggleLoadingIndicator(false));
}

function adminAddBeequipGroup() {
    const keyInput = document.getElementById('newAdminGroupKey');
    const imageInput = document.getElementById('newAdminGroupImage');
    const messageBox = document.getElementById('adminAddGroupMessage');
    
    const key = keyInput.value.trim();
    const image = imageInput.value.trim();
    const category = "Beequip Group";

    if (!key) {
        messageBox.textContent = 'Group Name is required.';
        messageBox.style.color = 'red';
        return;
    }

    messageBox.textContent = 'Adding...'; messageBox.style.color = '#3498db'; toggleLoadingIndicator(true);
    fetch('/api/admin/group/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, category, image }),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            messageBox.textContent = `Error: ${escapeHTML(data.error)}`;
            messageBox.style.color = 'red';
        } else {
            messageBox.textContent = escapeHTML(data.message);
            messageBox.style.color = 'green';
            keyInput.value = '';
            imageInput.value = '';
            fetchValues().then(renderAdminBeequipGroupsColumn);
        }
    })
    .catch(err => {
        messageBox.textContent = 'A network error occurred.';
        messageBox.style.color = 'red';
    })
    .finally(() => toggleLoadingIndicator(false));
}

function adminAddBeequipVariant(groupKey) {
    const subgroupSelect = document.getElementById('selectAdminVariantSubgroup');
    const detailsInput = document.getElementById('newAdminVariantDetails');
    const valueMinInput = document.getElementById('newAdminVariantValueMin');
    const valueMaxInput = document.getElementById('newAdminVariantValueMax');
    const demandInput = document.getElementById('newAdminVariantDemand'); // This was missing before
    const imageInput = document.getElementById('newAdminVariantImage'); // This was missing before
    const messageBox = document.getElementById('adminAddVariantMessage');

    const subgroup = subgroupSelect.value;
    const details = detailsInput.value.trim();

    if (!subgroup) {
        messageBox.textContent = 'You must select a subgroup.';
        messageBox.style.color = 'red';
        return;
    }

    // The suffix is the combination of the subgroup and its unique details
    const variant_suffix = details ? `${subgroup}, ${details}` : subgroup;

    const payload = {
        group_ref: groupKey,
        variant_suffix: variant_suffix,
        value_min: valueMinInput.value.trim(),
        value_max: valueMaxInput.value.trim() || valueMinInput.value.trim(),
        demand: demandInput ? demandInput.value.trim() : null, // Safely get value
        image: imageInput ? imageInput.value.trim() : "" // Safely get value
    };

    messageBox.textContent = 'Adding...'; messageBox.style.color = '#3498db'; toggleLoadingIndicator(true);
    fetch('/api/admin/beequip/variant/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            messageBox.textContent = `Error: ${escapeHTML(data.error)}`;
            messageBox.style.color = 'red';
        } else {
            messageBox.textContent = escapeHTML(data.message);
            messageBox.style.color = 'green';
            // Clear only the variant-specific fields
            [detailsInput, valueMinInput, valueMaxInput, demandInput, imageInput].forEach(el => { if(el) el.value = ''; });
            subgroupSelect.selectedIndex = 0;
            // Refresh data and UI
            fetchValues().then(() => renderAdminVariantsColumn(groupKey));
        }
    })
    .catch(err => {
        messageBox.textContent = 'A network error occurred.';
        messageBox.style.color = 'red';
    })
    .finally(() => toggleLoadingIndicator(false));
}

function deleteItemFromModal(itemKey) {
    if (!currentUser || !currentUser.is_admin) { alert('Admin privileges required.'); return; }
    const itemToDelete = valueList[itemKey]; const isGroup = itemToDelete && itemToDelete.category && itemToDelete.category.toLowerCase().includes('group');
    const confirmMessage = isGroup ? `Delete GROUP "${escapeHTML(itemKey)}"? Might fail if items reference it.` : `Delete ITEM "${escapeHTML(itemKey)}"?`;
    if (!confirm(confirmMessage)) return;
    toggleLoadingIndicator(true);
    fetch(`/api/admin/item/delete`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: itemKey }), credentials: 'include' })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => { if (status === 200 && body.message) { alert(escapeHTML(body.message)); closeItemModal(); fetchValues(); const searchBar = document.getElementById('searchBar'), beequipSearchBar = document.getElementById('beequipSearchBar'); if (searchBar && searchBar.value) { searchBar.value = ''; search(); } if (beequipSearchBar && beequipSearchBar.value) { beequipSearchBar.value = ''; searchBeequips(); } } else alert(`Error deleting: ${escapeHTML(body.error) || 'Unknown error'}`); })
    .catch(error => { console.error('Error during fetch for deletion:', error); alert('An error occurred during deletion request.'); })
    .finally(() => toggleLoadingIndicator(false));
}

function adminAddGroup() {
    const key = document.getElementById('newGroupKey').value.trim(), category = document.getElementById('newGroupCategory').value, image = document.getElementById('newGroupImage').value.trim(), messageBox = document.getElementById('addGroupMessage');
    if (!key || !category) { messageBox.textContent = 'Group Name and Category are required.'; messageBox.style.color = 'red'; return; }
    if (!category.toLowerCase().includes('group')) { messageBox.textContent = 'Category must contain "Group".'; messageBox.style.color = 'red'; return; }
    messageBox.textContent = 'Adding Group...'; messageBox.style.color = '#3498db'; toggleLoadingIndicator(true);
    fetch('/api/admin/group/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: key, category: category, image: image }), credentials: 'include' })
    .then(response => response.json())
    .then(data => { if (data.error) { messageBox.textContent = `Error: ${escapeHTML(data.error)}`; messageBox.style.color = 'red'; } else { messageBox.textContent = escapeHTML(data.message); messageBox.style.color = 'green'; fetchValues(); document.getElementById('newGroupKey').value = ''; document.getElementById('newGroupImage').value = ''; } })
    .catch(error => { console.error('Error adding group:', error); messageBox.textContent = 'Error adding group.'; messageBox.style.color = 'red'; })
    .finally(() => toggleLoadingIndicator(false));
}

function adminUpdateGroupImage(groupKey) {
    const currentGroup = valueList[groupKey]; const currentImage = currentGroup ? currentGroup.image : '';
    const newImageUrl = prompt(`Enter new image URL for group "${escapeHTML(groupKey)}" (leave blank to clear):`, currentImage);
    if (newImageUrl === null) return;
    toggleLoadingIndicator(true);
    fetch('/api/admin/group/update', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: groupKey, image: newImageUrl.trim() }), credentials: 'include' })
    .then(response => response.json())
    .then(data => { if (data.error) alert(`Error updating group image: ${escapeHTML(data.error)}`); else { alert(escapeHTML(data.message)); fetchValues(); } })
    .catch(error => { console.error('Error updating group image:', error); alert('Error updating group image.'); })
    .finally(() => toggleLoadingIndicator(false));
}

function adminDeleteItemOrGroup(itemKey) {
    const item = valueList[itemKey]; const isGroup = item && item.category && item.category.toLowerCase().includes('group');
    const confirmMessage = isGroup ? `Delete GROUP "${escapeHTML(itemKey)}"? Might fail if items reference it.` : `Delete ITEM "${escapeHTML(itemKey)}"?`;
    if (!confirm(confirmMessage)) return;
    toggleLoadingIndicator(true);
    fetch(`/api/admin/item/delete`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: itemKey }), credentials: 'include' })
    .then(response => response.json())
    .then(data => { if (data.error) alert(`Error deleting: ${escapeHTML(data.error)}`); else { alert(escapeHTML(data.message)); fetchValues(); } })
    .catch(error => { console.error('Error deleting:', error); alert('Error during deletion.'); })
    .finally(() => toggleLoadingIndicator(false));
}

function adminAddItem() {
    const name = document.getElementById('newItemName').value.trim(), category = document.getElementById('newItemCategory').value, valueMinInput = document.getElementById('newItemValueMin').value, valueMaxInput = document.getElementById('newItemValueMax').value, image = document.getElementById('newItemImage').value.trim(), groupRef = document.getElementById('newItemParentGroup').value || null, messageBox = document.getElementById('addItemMessage');
    const acronyms = document.getElementById('newItemAcronyms').value.trim();

    if (!name) { messageBox.textContent = 'Item Name (Key) is required.'; messageBox.style.color = 'red'; return; }
    if (category.toLowerCase().includes('group')) { messageBox.textContent = 'Cannot add Group via this form.'; messageBox.style.color = 'red'; return; }
    const valueMin = (valueMinInput === '' || valueMinInput === null) ? 0 : parseFloat(valueMinInput), valueMax = (valueMaxInput === '' || valueMaxInput === null) ? 0 : parseFloat(valueMaxInput);
    if (isNaN(valueMin) || isNaN(valueMax)) { messageBox.textContent = 'Min/Max values must be numbers or blank (defaults to 0).'; messageBox.style.color = 'red'; return; }
    if (valueMin > valueMax) { messageBox.textContent = 'Min Value cannot be > Max Value.'; messageBox.style.color = 'red'; return; }
    messageBox.textContent = 'Adding Item...'; messageBox.style.color = '#3498db'; toggleLoadingIndicator(true);
    fetch('/api/admin/item/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: name, category: category, value_min: valueMin, value_max: valueMax, image: image, group_ref: groupRef, acronyms: acronyms }), credentials: 'include' })
    .then(response => response.json())
    .then(data => { if (data.error) { messageBox.textContent = `Error: ${escapeHTML(data.error)}`; messageBox.style.color = 'red'; } else { messageBox.textContent = escapeHTML(data.message); messageBox.style.color = 'green'; fetchValues(); document.getElementById('newItemName').value = ''; document.getElementById('newItemValueMin').value = '0'; document.getElementById('newItemValueMax').value = '0'; document.getElementById('newItemImage').value = ''; document.getElementById('newItemParentGroup').value = ''; document.getElementById('newItemAcronyms').value = '';} })
    .catch(error => { console.error('Error adding item:', error); messageBox.textContent = 'Error adding item.'; messageBox.style.color = 'red'; })
    .finally(() => toggleLoadingIndicator(false));
}

function openEditModalForItem(itemKey) {
    const item = valueList[itemKey]; if (!item) { alert('Item not found.'); return; }
    if (item.category && item.category.toLowerCase().includes('group')) alert(`Editing for Groups (${escapeHTML(itemKey)}) is handled via specific buttons. Groups do not have direct values.`);
    else if (item.category === 'Beequip') openBeequipModal(itemKey, getBeequipDisplayImage(item));
    else openModal(itemKey);
}

function populateAdminLogsTab() {
    const container = document.getElementById('adminLogsContent'); if (!container) return;
    container.innerHTML = 'Loading logs...'; toggleLoadingIndicator(true);
    fetch('/api/admin/logs', { credentials: 'include' })
        .then(response => response.json())
        .then(logs => {
            if (logs.error) { container.innerHTML = `<p style="color:red;">Error: ${escapeHTML(logs.error)}</p>`; return; }
            if (!logs || logs.length === 0) { container.innerHTML = '<p>No admin actions logged yet.</p>'; return; }
            let logsHtml = `<table class="admin-logs-table"><thead><tr><th>Timestamp (UTC)</th><th>Admin</th><th>Action</th><th>Details</th></tr></thead><tbody>`;
            logs.forEach(log => logsHtml += `<tr><td>${escapeHTML(new Date(log.timestamp).toLocaleString('en-GB', { timeZone: 'UTC' }))}</td><td>${escapeHTML(log.admin_username)} (${escapeHTML(log.admin_id)})</td><td>${escapeHTML(log.action)}</td><td><pre>${escapeHTML(JSON.stringify(log.details, null, 2))}</pre></td></tr>`);
            logsHtml += '</tbody></table>'; logsHtml = '<div class="table-responsive-wrapper">' + logsHtml + '</div>'; container.innerHTML = logsHtml;
        })
        .catch(error => { console.error('Error fetching admin logs:', error); container.innerHTML = '<p style="color:red;">Failed to load admin logs.</p>'; })
        .finally(() => toggleLoadingIndicator(false));
}

function adminBanUserFromPanel() {
    if (!currentUser || (!currentUser.is_admin && !currentUser.is_moderator)) { alert('Admins/Mods only'); return; }
    const identifier = document.getElementById('banIdentifier').value.trim(), idType = document.getElementById('banIdType').value, reason = document.getElementById('banReasonAdmin').value.trim() || "No reason provided.", messageBox = document.getElementById('adminBanMessage');
    if (!identifier) { messageBox.textContent = 'User Identifier is required.'; messageBox.style.color = 'red'; return; }
    messageBox.textContent = "Processing ban..."; messageBox.style.color = '#3498db'; toggleLoadingIndicator(true);
    fetch('/api/admin/ban', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier, id_type: idType, reason, admin_discord_id: currentUser.discord_id }), credentials: 'include' })
    .then(response => { if (!response.ok) return response.text().then(text => { try { const errData = JSON.parse(text); throw new Error(errData.error || `Server error: ${response.status}`); } catch (e) { console.error("Raw non-JSON error response:", text); throw new Error(`Server error: ${response.status}. Response not valid JSON.`); } }); return response.json(); })
    .then(data => { if (data.error) { messageBox.textContent = `Error: ${escapeHTML(data.error)}`; messageBox.style.color = 'red'; } else { messageBox.textContent = escapeHTML(data.message); messageBox.style.color = 'green'; } })
    .catch(error => { console.error('Error banning user:', error); messageBox.textContent = `An error occurred: ${escapeHTML(error.message)}`; messageBox.style.color = 'red'; })
    .finally(() => toggleLoadingIndicator(false));
}

function adminUnbanUserFromPanel() {
    if (!currentUser || (!currentUser.is_admin && !currentUser.is_moderator)) { alert('Admins/Mods only'); return; }
    const identifier = document.getElementById('unbanIdentifier').value.trim(), idType = document.getElementById('unbanIdType').value, messageBox = document.getElementById('adminUnbanMessage');
    if (!identifier) { messageBox.textContent = 'User Identifier is required.'; messageBox.style.color = 'red'; return; }
    messageBox.textContent = "Processing unban..."; messageBox.style.color = '#3498db'; toggleLoadingIndicator(true);
    fetch('/api/admin/unban', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier, id_type: idType, admin_discord_id: currentUser.discord_id }), credentials: 'include' })
    .then(response => response.json().then(data => { if (!response.ok) throw { status: response.status, body: data }; return data; }))
    .then(data => { messageBox.textContent = escapeHTML(data.message) || "Unban processed successfully."; messageBox.style.color = 'green'; let unbannedUserIsCurrentUser = false; if (idType === 'discord' && currentUser && currentUser.discord_id === identifier) unbannedUserIsCurrentUser = true; else if (idType === 'roblox' && currentUser && currentUser.roblox_id && currentUser.roblox_id === identifier) unbannedUserIsCurrentUser = true; if (data.unbanned_discord_id && currentUser && currentUser.discord_id === data.unbanned_discord_id) unbannedUserIsCurrentUser = true; if(data.action === "clear_ban_flag" || unbannedUserIsCurrentUser) { console.log("Server/Self unban indicated client flag clear. Clearing localStorage."); localStorage.removeItem('bssmUserBanned'); localStorage.removeItem('bssmBanReason'); if (currentUser) currentUser.banned = false; alert("You have been unbanned. The page will now reload to reflect your new status."); window.location.reload(); } })
    .catch(error => { console.error('Error unbanning user:', error); if (error.body && error.body.error) messageBox.textContent = `Error: ${escapeHTML(error.body.error)}`; else if (error.status) messageBox.textContent = `Server error (${error.status}). Check console.`; else messageBox.textContent = `An error occurred: ${escapeHTML(error.message) || 'Network error'}`; messageBox.style.color = 'red'; })
    .finally(() => toggleLoadingIndicator(false));
}

function toggleListingFields() {
    const listingType = document.getElementById('listingType').value, priceGroup = document.getElementById('priceGroup'), startingBidGroup = document.getElementById('startingBidGroup'), auctionDurationGroup = document.getElementById('auctionDurationGroup'), lookingForGroup = document.getElementById('lookingForGroup');
    if(priceGroup) priceGroup.style.display = (listingType === 'auction') ? 'none' : 'block';
    if(startingBidGroup) startingBidGroup.style.display = (listingType === 'auction') ? 'block' : 'none';
    if(auctionDurationGroup) auctionDurationGroup.style.display = (listingType === 'auction') ? 'block' : 'none';
    if(lookingForGroup) lookingForGroup.style.display = (listingType === 'buy') ? 'none' : 'block';
}

function refreshListings() {
    toggleLoadingIndicator(true); const filterType = document.getElementById('filterType').value; let url = '/api/market/listings'; const params = [];
    if (filterType && filterType !== 'all') params.push(`type=${filterType}`); if (params.length > 0) url += '?' + params.join('&');
    fetch(url, { credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason || "Account restricted."); return Promise.reject(new Error("Banned user")); }); if (!response.ok) throw new Error(`HTTP error ${response.status}`); return response.json(); })
    .then(data => { currentListings = data; renderFilteredAndSortedListings(); toggleLoadingIndicator(false); })
    .catch(error => { if (error.message !== "Banned user") { console.error('Error fetching listings:', error); const container = document.getElementById('listingsContainer'); if(container) container.innerHTML = `<div class="empty-state"><p>Error loading listings.</p></div>`; } toggleLoadingIndicator(false); });
}

function formatDate(dateString, includeTime = true) {
    if (!dateString) return 'Unknown date';
    try { const date = new Date(dateString); if (isNaN(date.getTime())) return 'Invalid date'; return includeTime ? date.toLocaleString() : date.toLocaleDateString(); }
    catch (e) { return 'Invalid date format'; }
}

function formatTimeRemaining(endTimeString) {
    if (!endTimeString) return 'Unknown'; let endTime; let cleanedEndTimeString = endTimeString;
    if (cleanedEndTimeString.match(/\.\d{6}\+00:00Z$/)) cleanedEndTimeString = cleanedEndTimeString.slice(0, -1);
    try { endTime = new Date(cleanedEndTimeString); if (isNaN(endTime.getTime())) return 'Invalid Date'; } catch (e) { console.error("Error parsing auction end time:", endTimeString, e); return 'Error Parsing Date'; }
    const now = new Date(); if (now.getTime() >= endTime.getTime()) return 'Ended'; const timeLeft = endTime.getTime() - now.getTime(); if (timeLeft <= 0) return 'Ended';
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24)), hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}d ${hours}h left`; if (hours > 0) return `${hours}h ${minutes}m left`; if (minutes > 0) return `${minutes}m left`; return 'Ending soon';
}

function displayListingsDOM(listingsToDisplay) {
    const container = document.getElementById('listingsContainer'); if(!container) return;
    if (!listingsToDisplay || listingsToDisplay.length === 0) { container.innerHTML = `<div class="empty-state"><img src="/static/images/bee_cub_placeholder.png" alt="Empty state"><p>No listings found.</p></div>`; return; }
    let html = '';
    listingsToDisplay.forEach(listing => {
        const listingType = listing.listing_type, typeIcon = listingType === 'sell' ? '📦' : listingType === 'buy' ? '🔍' : '🔨', typeLabel = listingType === 'sell' ? 'Selling' : listingType === 'buy' ? 'Looking For' : 'Auction', typeClass = `listing-${listingType}`;
        let imageHtml = listing.image_url ? `<div class="listing-image-preview"><img src="${escapeHTML(listing.image_url)}" alt="Listing image" onclick="openImageModal('${escapeHTML(listing.image_url)}')"></div>` : '';
        const lookingForText = listing.looking_for ? escapeHTML(listing.looking_for) : '<em>Not specified</em>';
        const sellerDisplayName = listing.display_name || listing.discord_username || "Unknown Seller";
        const currentBidderDisplayName = listing.current_bidder_display_name || "No bids yet";
        html += `<div class="listing-card ${typeClass}" data-id="${listing.id}"><div class="listing-header"><span class="listing-type"><span class="type-icon">${typeIcon}</span> ${escapeHTML(typeLabel)}</span><span class="listing-date">${formatDate(listing.created_at)}</span></div><div class="listing-body"><div class="listing-text-content"><h3>${escapeHTML(listing.items)}</h3>${listingType === 'auction' ? `<div class="auction-info"><p><strong>Current Bid:</strong> ${escapeHTML(String(listing.current_bid))} Signs</p><p><strong>Bidder:</strong> ${escapeHTML(currentBidderDisplayName)}</p><p><strong>Ends:</strong> ${formatTimeRemaining(listing.auction_end)}</p></div>` : `<p class="listing-price"><strong>${listingType === 'sell' ? 'Price' : 'Offering'}:</strong> ${listing.price ? escapeHTML(String(listing.price)) : 'Negotiable'} Signs</p>`}<p><strong>Looking For:</strong> ${lookingForText}</p><p class="contact-info"><strong>Seller:</strong> ${escapeHTML(sellerDisplayName)}</p></div>${imageHtml}</div><div class="listing-footer">${listingType === 'auction' && listing.status === 'active' ? `<button onclick="openBidModal('${listing.id}')" class="bid-button">Place Bid</button>` : (listingType !== 'auction' ? `<button onclick="initiateChatFromListing('${listing.discord_id}', '${escapeHTML(listing.discord_username)}', '${escapeHTML(listing.avatar) || ''}')" class="contact-button">Contact Seller</button>` : (listing.status === 'expired' || listing.status === 'completed' ? '<span class="auction-ended-label">Auction Ended</span>' : ''))}<button onclick="viewListingDetails('${listing.id}')" class="details-button">View Details</button></div></div>`;
    });
    container.innerHTML = html;
}

function filterListings() { renderFilteredAndSortedListings(); }

async function createListing() {
    if (!currentUser) { alert('Log in to create listing'); return; } if (currentUser.banned) { showBanOverlay(currentUser.reason); return; } if (!currentUser.roblox_verified) { alert('Verify Roblox account first.'); showRobloxVerificationOverlay(); return; }
    const listingType = document.getElementById('listingType').value, items = document.getElementById('itemsList').value.trim(), price = document.getElementById('price').value, startingBid = document.getElementById('startingBid').value, lookingFor = document.getElementById('lookingFor').value.trim(), messageBox = document.getElementById('createListingMessage'), imageFile = document.getElementById('listingImage').files[0];
    if (!items) { messageBox.textContent = 'Please list items'; messageBox.style.color = 'red'; return; }
    if (items.length > LISTING_FIELD_MAX_LENGTH_CLIENT_SIDE) { messageBox.textContent = `Items field cannot exceed ${LISTING_FIELD_MAX_LENGTH_CLIENT_SIDE} characters.`; messageBox.style.color = 'red'; return; }
    if (lookingFor.length > LISTING_FIELD_MAX_LENGTH_CLIENT_SIDE) { messageBox.textContent = `Looking For field cannot exceed ${LISTING_FIELD_MAX_LENGTH_CLIENT_SIDE} characters.`; messageBox.style.color = 'red'; return; }
    if (price && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) { messageBox.textContent = 'Price must be a non-negative number or blank.'; messageBox.style.color = 'red'; return; }
    if (listingType === 'auction') { if (!startingBid) { messageBox.textContent = 'Enter starting bid'; messageBox.style.color = 'red'; return; } if (isNaN(parseFloat(startingBid)) || parseFloat(startingBid) < 0) { messageBox.textContent = 'Starting bid must be a non-negative number.'; messageBox.style.color = 'red'; return; } }
    const now = new Date().getTime(); const lastListingTime = parseInt(sessionStorage.getItem('lastListingTime') || '0');
    if (now - lastListingTime < LISTING_RATE_LIMIT_SECONDS_CLIENT_SIDE * 1000) { const remaining = Math.ceil((LISTING_RATE_LIMIT_SECONDS_CLIENT_SIDE * 1000 - (now - lastListingTime)) / 1000); messageBox.textContent = `Please wait ${Math.floor(remaining/60)}m ${remaining%60}s to list again.`; messageBox.style.color = 'red'; return; }

    toggleLoadingIndicator(true); messageBox.textContent = 'Creating...'; messageBox.style.color = '#3498db'; let uploadedImageUrl = null;
    if (imageFile) {
        if (imageFile.size > 2 * 1024 * 1024) { messageBox.textContent = 'Image max 2MB.'; messageBox.style.color = 'red'; toggleLoadingIndicator(false); return; }
        const formData = new FormData(); formData.append('file', imageFile);
        try {
            messageBox.textContent = 'Uploading image...'; const uploadResponse = await fetch('/api/market/upload_image', { method: 'POST', body: formData, credentials: 'include' }); const uploadData = await uploadResponse.json();
            if (!uploadResponse.ok || uploadData.error) { if (uploadResponse.status === 403 && uploadData.error === "banned") { showBanOverlay(uploadData.reason || "Account restricted."); toggleLoadingIndicator(false); return; } messageBox.textContent = `Image upload failed: ${escapeHTML(uploadData.error) || 'Server error'}`; messageBox.style.color = 'red'; toggleLoadingIndicator(false); return; }
            uploadedImageUrl = uploadData.image_url; messageBox.textContent = 'Image uploaded, creating listing...';
        } catch (error) { console.error('Image upload error:', error); messageBox.textContent = 'Image upload failed.'; messageBox.style.color = 'red'; toggleLoadingIndicator(false); return; }
    }
    const listingData = { listing_type: listingType, items: items, looking_for: lookingFor, image_url: uploadedImageUrl };
    if (listingType === 'sell' || listingType === 'buy') listingData.price = price;
    if (listingType === 'auction') {
        listingData.starting_bid = startingBid; const days = parseInt(document.getElementById('auctionDays').value) || 0, hours = parseInt(document.getElementById('auctionHours').value) || 0; let minutes = parseInt(document.getElementById('auctionMinutes').value) || 0;
        if (days === 0 && hours === 0 && minutes === 0) minutes = 5; listingData.duration_days = days; listingData.duration_minutes = minutes + (hours * 60);
    }
    try {
        const listingResponse = await fetch('/api/market/listings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(listingData), credentials: 'include' });
        const listingResultData = await listingResponse.json(); toggleLoadingIndicator(false);
        if (!listingResponse.ok || listingResultData.error) { if (listingResponse.status === 403 && listingResultData.error === "banned") { showBanOverlay(listingResultData.reason || "Account restricted."); return; } messageBox.textContent = `Listing creation failed: ${escapeHTML(listingResultData.error) || 'Server error'}`; messageBox.style.color = 'red'; }
        else {
            messageBox.textContent = 'Listing created!'; messageBox.style.color = 'green'; sessionStorage.setItem('lastListingTime', new Date().getTime().toString());
            document.getElementById('itemsList').value = ''; document.getElementById('price').value = ''; document.getElementById('startingBid').value = ''; document.getElementById('lookingFor').value = ''; document.getElementById('listingImage').value = ''; document.getElementById('auctionDays').value = '3'; document.getElementById('auctionHours').value = '0'; document.getElementById('auctionMinutes').value = '0';
            if (document.getElementById('BrowseListings').style.display === 'block') refreshListings(); if (listingType === 'auction' && document.getElementById('Auctions').style.display === 'block') refreshAuctions();
        }
    } catch (error) { console.error('Listing creation error:', error); messageBox.textContent = 'Error creating listing.'; messageBox.style.color = 'red'; toggleLoadingIndicator(false); }
}

function loadMyListings() {
    if (!currentUser) { alert('Log in to view listings'); return; } if (currentUser.banned) { showBanOverlay(currentUser.reason); return; }
    toggleLoadingIndicator(true);
    fetch('/api/market/listings?mine=true&include_inactive=true', { credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); }); if (!response.ok) throw new Error(`HTTP error ${response.status}`); return response.json(); })
    .then(data => {
        const activeListings = {}, completedListings = {}, endedAuctionsToNotify = [];
        for (const id in data) { if (data[id].discord_id === currentUser.discord_id) { if (data[id].status === 'active') activeListings[id] = data[id]; else { completedListings[id] = data[id]; if (data[id].listing_type === 'auction' && (data[id].status === 'expired' || data[id].status === 'completed')) endedAuctionsToNotify.push(data[id]); } } }
        const activeContainer = document.getElementById('activeListingsContainer');
        if (Object.keys(activeListings).length === 0) activeContainer.innerHTML = `<div class="empty-state"><img src="/static/images/bee_cub_placeholder.png" alt="Empty state"><p>No active listings</p></div>`;
        else { let html = '<div class="my-listings-grid">'; for (const id in activeListings) { const listing = activeListings[id]; let footerContent = ''; if (listing.listing_type === 'auction') { if (listing.current_bidder_id) footerContent += `<span class="auction-has-bids-info" style="font-size:0.8em; color: var(--accent-color);">Has bids. Cannot delete/cancel.</span>`; else { footerContent += `<button onclick="markCompleted('${id}')" class="complete-button">Cancel Auction</button><button onclick="deleteListing('${id}')" class="delete-button">Delete Auction</button>`; } } else { footerContent += `<button onclick="markCompleted('${id}')" class="complete-button">Mark Completed</button><button onclick="deleteListing('${id}')" class="delete-button">Delete</button>`; } html += `<div class="my-listing-card"><div class="my-listing-header"><h4>${escapeHTML(listing.items)}</h4><span class="listing-type">${escapeHTML(listing.listing_type.toUpperCase())}</span></div><div class="my-listing-body"><p><strong>Created:</strong> ${formatDate(listing.created_at)}</p>${listing.listing_type === 'auction' ? `<p><strong>Current Bid:</strong> ${escapeHTML(String(listing.current_bid))} Signs</p><p><strong>Ends:</strong> ${formatTimeRemaining(listing.auction_end)}</p>` : `<p><strong>Price:</strong> ${listing.price ? escapeHTML(String(listing.price)) : 'Negotiable'} Signs</p>`}</div><div class="my-listing-footer">${footerContent}</div></div>`; } html += '</div>'; activeContainer.innerHTML = html; }
        const completedContainer = document.getElementById('completedListingsContainer');
        if (Object.keys(completedListings).length === 0) completedContainer.innerHTML = `<div class="empty-state"><img src="/static/images/brown_cub_placeholder.png" alt="Empty state"><p>No completed listings</p></div>`;
        else { let html = '<div class="my-listings-grid">'; for (const id in completedListings) { const listing = completedListings[id]; let outcomeButton = ''; if (listing.listing_type === 'auction' && (listing.status === 'expired' || listing.status === 'completed') && listing.current_bidder_id) outcomeButton = `<button onclick="fetchAndShowAuctionOutcome('${id}')" class="details-button" style="background-color: var(--primary-color); color:white; margin-right:5px;">View Outcome</button>`; html += `<div class="my-listing-card completed"><div class="my-listing-header"><h4>${escapeHTML(listing.items)}</h4><span class="listing-type">${escapeHTML(listing.listing_type.toUpperCase())}</span></div><div class="my-listing-body"><p><strong>Created:</strong> ${formatDate(listing.created_at)}</p><p><strong>Status:</strong> ${escapeHTML(listing.status)}</p>${listing.listing_type === 'auction' ? `<p><strong>Winning Bid:</strong> ${escapeHTML(String(listing.current_bid))} Signs</p>` : ''}</div><div class="my-listing-footer">${outcomeButton}<button onclick="deleteListing('${id}')" class="delete-button">Delete</button></div></div>`; } html += '</div>'; completedContainer.innerHTML = html; }
        if (endedAuctionsToNotify.length > 0) { const firstEndedAuction = endedAuctionsToNotify.find(auc => auc.current_bidder_id); if (firstEndedAuction) { const shownAuctionOutcomes = JSON.parse(sessionStorage.getItem('shownAuctionOutcomes') || '[]'); if (!shownAuctionOutcomes.includes(firstEndedAuction.id)) fetchAndShowAuctionOutcome(firstEndedAuction.id, true); } }
        toggleLoadingIndicator(false);
    })
    .catch(error => { if (error.message !== "Banned user") { console.error('Error:', error); document.getElementById('activeListingsContainer').innerHTML = `<div class="empty-state"><p>Error loading. Try again.</p></div>`; } toggleLoadingIndicator(false); });
}

async function fetchAndShowAuctionOutcome(listingId, markAsShownOnOpen = false) {
    toggleLoadingIndicator(true);
    try {
        const response = await fetch(`/api/market/listings/${listingId}`, { credentials: 'include' });
        if (!response.ok) { const errData = await response.json(); throw new Error(errData.error || `HTTP error ${response.status}`); }
        const listingDetails = await response.json(); toggleLoadingIndicator(false);
        if (listingDetails.top_bidders_contact && listingDetails.top_bidders_contact.length > 0) {
            showAuctionOutcomeModal(listingDetails);
            if (markAsShownOnOpen) { const shownAuctionOutcomes = JSON.parse(sessionStorage.getItem('shownAuctionOutcomes') || '[]'); if (!shownAuctionOutcomes.includes(listingId)) { shownAuctionOutcomes.push(listingId); sessionStorage.setItem('shownAuctionOutcomes', JSON.stringify(shownAuctionOutcomes)); } }
        } else alert("Auction ended with no winning bids or bidder information is unavailable.");
    } catch (error) { toggleLoadingIndicator(false); console.error("Error fetching auction outcome:", error); alert(`Could not load auction outcome: ${escapeHTML(error.message)}`); }
}

async function fetchAndShowAuctionOutcome(listingId, markAsShownOnOpen = false) {
    toggleLoadingIndicator(true);
    try {
        const response = await fetch(`/api/market/listings/${listingId}`, { credentials: 'include' });
        if (!response.ok) { const errData = await response.json(); throw new Error(errData.error || `HTTP error ${response.status}`); }
        const listingDetails = await response.json(); toggleLoadingIndicator(false);
        if (listingDetails.top_bidders_contact && listingDetails.top_bidders_contact.length > 0) {
            showAuctionOutcomeModal(listingDetails);
            if (markAsShownOnOpen) { const shownAuctionOutcomes = JSON.parse(sessionStorage.getItem('shownAuctionOutcomes') || '[]'); if (!shownAuctionOutcomes.includes(listingId)) { shownAuctionOutcomes.push(listingId); sessionStorage.setItem('shownAuctionOutcomes', JSON.stringify(shownAuctionOutcomes)); } }
        } else alert("Auction ended with no winning bids or bidder information is unavailable.");
    } catch (error) { toggleLoadingIndicator(false); console.error("Error fetching auction outcome:", error); alert(`Could not load auction outcome: ${escapeHTML(error.message)}`); }
}

function showAuctionOutcomeModal(listing) {
    const modal = document.getElementById('auctionOutcomeModal'), titleEl = document.getElementById('auctionOutcomeTitle'), biddersListEl = document.getElementById('auctionOutcomeBidders'), actionsEl = document.getElementById('auctionOutcomeActions');
    if (!modal || !titleEl || !biddersListEl || !actionsEl) { console.error("Auction outcome modal elements not found!"); return; }
    titleEl.textContent = `Auction Ended: ${escapeHTML(listing.items)}`; biddersListEl.innerHTML = '';
    if (listing.top_bidders_contact && listing.top_bidders_contact.length > 0) {
        const winner = listing.top_bidders_contact[0]; const winnerEl = document.createElement('div'); winnerEl.className = 'auction-bidder winner';
        winnerEl.innerHTML = `<h4>🏆 Winner!</h4><p><strong>${escapeHTML(winner.bidder_display_name)}</strong> (@${escapeHTML(winner.bidder_discord_username)})</p><p>Bid: ${escapeHTML(String(winner.bid_amount))} Signs</p><button class="contact-button" onclick="initiateChatFromListing('${winner.bidder_id}', '${escapeHTML(winner.bidder_discord_username)}', '${escapeHTML(winner.bidder_avatar) || ''}'); closeAuctionOutcomeModal();">Contact Winner</button>`; biddersListEl.appendChild(winnerEl);
        if (listing.top_bidders_contact.length > 1) { const runnerUpHeader = document.createElement('h5'); runnerUpHeader.textContent = "Other Top Bidders:"; runnerUpHeader.style.marginTop = "15px"; biddersListEl.appendChild(runnerUpHeader); for (let i = 1; i < listing.top_bidders_contact.length; i++) { const bidder = listing.top_bidders_contact[i]; const bidderEl = document.createElement('div'); bidderEl.className = 'auction-bidder'; bidderEl.innerHTML = `<p><strong>${i + 1}. ${escapeHTML(bidder.bidder_display_name)}</strong> (@${escapeHTML(bidder.bidder_discord_username)})</p><p>Bid: ${escapeHTML(String(bidder.bid_amount))} Signs</p><button class="contact-button secondary" onclick="initiateChatFromListing('${bidder.bidder_id}', '${escapeHTML(bidder.bidder_discord_username)}', '${escapeHTML(bidder.bidder_avatar) || ''}'); closeAuctionOutcomeModal();">Contact</button>`; biddersListEl.appendChild(bidderEl); } }
    } else biddersListEl.innerHTML = '<p>No bids were placed on this auction, or winner information is unavailable.</p>';
    actionsEl.innerHTML = ''; if (listing.status !== 'completed') { const completeButton = document.createElement('button'); completeButton.textContent = 'Mark as Completed'; completeButton.className = 'complete-button action-btn'; completeButton.onclick = () => { markCompleted(listing.id); closeAuctionOutcomeModal(); }; actionsEl.appendChild(completeButton); }
    modal.style.display = 'block';
}

function closeAuctionOutcomeModal() { const modal = document.getElementById('auctionOutcomeModal'); if (modal) modal.style.display = 'none'; }


function showAuctionOutcomeModal(listing) {
    const modal = document.getElementById('auctionOutcomeModal'), titleEl = document.getElementById('auctionOutcomeTitle'), biddersListEl = document.getElementById('auctionOutcomeBidders'), actionsEl = document.getElementById('auctionOutcomeActions');
    if (!modal || !titleEl || !biddersListEl || !actionsEl) { console.error("Auction outcome modal elements not found!"); return; }
    titleEl.textContent = `Auction Ended: ${escapeHTML(listing.items)}`; biddersListEl.innerHTML = '';
    if (listing.top_bidders_contact && listing.top_bidders_contact.length > 0) {
        const winner = listing.top_bidders_contact[0]; const winnerEl = document.createElement('div'); winnerEl.className = 'auction-bidder winner';
        winnerEl.innerHTML = `<h4>🏆 Winner!</h4><p><strong>${escapeHTML(winner.bidder_display_name)}</strong> (@${escapeHTML(winner.bidder_discord_username)})</p><p>Bid: ${escapeHTML(String(winner.bid_amount))} Signs</p><button class="contact-button" onclick="initiateChatFromListing('${winner.bidder_id}', '${escapeHTML(winner.bidder_discord_username)}', '${escapeHTML(winner.bidder_avatar) || ''}'); closeAuctionOutcomeModal();">Contact Winner</button>`; biddersListEl.appendChild(winnerEl);
        if (listing.top_bidders_contact.length > 1) { const runnerUpHeader = document.createElement('h5'); runnerUpHeader.textContent = "Other Top Bidders:"; runnerUpHeader.style.marginTop = "15px"; biddersListEl.appendChild(runnerUpHeader); for (let i = 1; i < listing.top_bidders_contact.length; i++) { const bidder = listing.top_bidders_contact[i]; const bidderEl = document.createElement('div'); bidderEl.className = 'auction-bidder'; bidderEl.innerHTML = `<p><strong>${i + 1}. ${escapeHTML(bidder.bidder_display_name)}</strong> (@${escapeHTML(bidder.bidder_discord_username)})</p><p>Bid: ${escapeHTML(String(bidder.bid_amount))} Signs</p><button class="contact-button secondary" onclick="initiateChatFromListing('${bidder.bidder_id}', '${escapeHTML(bidder.bidder_discord_username)}', '${escapeHTML(bidder.bidder_avatar) || ''}'); closeAuctionOutcomeModal();">Contact</button>`; biddersListEl.appendChild(bidderEl); } }
    } else biddersListEl.innerHTML = '<p>No bids were placed on this auction, or winner information is unavailable.</p>';
    actionsEl.innerHTML = ''; if (listing.status !== 'completed') { const completeButton = document.createElement('button'); completeButton.textContent = 'Mark as Completed'; completeButton.className = 'complete-button action-btn'; completeButton.onclick = () => { markCompleted(listing.id); closeAuctionOutcomeModal(); }; actionsEl.appendChild(completeButton); }
    modal.style.display = 'block';
}

function closeAuctionOutcomeModal() { const modal = document.getElementById('auctionOutcomeModal'); if (modal) modal.style.display = 'none'; }

function deleteListing(listingId) {
    if (currentUser && currentUser.banned) { showBanOverlay(currentUser.reason); return; } if (!confirm('Delete this listing?')) return;
    toggleLoadingIndicator(true);
    fetch(`/api/market/listings/${listingId}`, { method: 'DELETE', credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); }); if (!response.ok) return response.json().then(data => Promise.reject(data.error || `HTTP error ${response.status}`)); return response.json(); })
    .then(data => { toggleLoadingIndicator(false); if (data.error) alert(escapeHTML(data.error)); else { alert('Listing deleted'); loadMyListings(); } })
    .catch(error => { if(error.message !== "Banned user") { console.error('Error:', error); alert(`Error deleting: ${escapeHTML(error.message || error)}`);} toggleLoadingIndicator(false); });
}

function markCompleted(listingId) {
    if (currentUser && currentUser.banned) { showBanOverlay(currentUser.reason); return; }
    toggleLoadingIndicator(true);
    fetch(`/api/market/listings/${listingId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'completed' }), credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); }); if (!response.ok) return response.json().then(data => Promise.reject(data.error || `HTTP error ${response.status}`)); return response.json(); })
    .then(data => { toggleLoadingIndicator(false); if (data.error) alert(escapeHTML(data.error)); else { alert('Marked as completed'); loadMyListings(); } })
    .catch(error => { if(error.message !== "Banned user") {console.error('Error:', error); alert(`Error updating: ${escapeHTML(error.message || error)}`);} toggleLoadingIndicator(false); });
}

function openBidModal(listingId) {
    if (!currentUser) { alert('Log in to place a bid'); return; } if (currentUser.banned) { showBanOverlay(currentUser.reason); return; } if (!currentUser.roblox_verified) { alert('Verify Roblox account first.'); showRobloxVerificationOverlay(); return; }
    const modal = document.getElementById('bidModal'), listing = currentListings[listingId] || currentAuctions[listingId];
    if (!listing) { alert('Listing not found'); return; } if (listing.discord_id === currentUser.discord_id) { alert('Cannot bid on own auction'); return; } if (listing.status !== 'active') { alert('This auction is not active.'); return; }
    currentListingId = listingId; const currentBidFloat = parseFloat(listing.current_bid), startingBidFloat = parseFloat(listing.starting_bid); let minBid, minBidMessageText;
    if (listing.current_bidder_id === null || listing.current_bidder_id === undefined) { minBid = startingBidFloat; minBidMessageText = `Minimum bid is ${minBid.toFixed(2)} Signs (starting bid).`; }
    else { const minIncrement = Math.max(0.01, currentBidFloat * 0.05); minBid = parseFloat((currentBidFloat + minIncrement).toFixed(2)); minBidMessageText = `Minimum bid is ${minBid.toFixed(2)} Signs (current bid + 5% or 0.01).`; }
    document.getElementById('bidAmount').value = minBid.toFixed(2); document.getElementById('minBidMessage').textContent = escapeHTML(minBidMessageText);
    const sellerDisplayName = listing.display_name || listing.discord_username || "Unknown Seller", currentBidderDisplayName = listing.current_bidder_display_name || "No bids yet";
    document.getElementById('bidItemDetails').innerHTML = `<div class="bid-item-info"><h3>${escapeHTML(listing.items)}</h3><p><strong>Current Bid:</strong> ${escapeHTML(String(listing.current_bid))} Signs</p><p><strong>Current Bidder:</strong> ${escapeHTML(currentBidderDisplayName)}</p><p><strong>Auction Ends:</strong> ${formatTimeRemaining(listing.auction_end)}</p><p><strong>Seller:</strong> ${escapeHTML(sellerDisplayName)}</p></div>`; modal.style.display = 'block';
}

function closeBidModal() { const bidModal = document.getElementById('bidModal'); if (bidModal) bidModal.style.display = 'none'; const bidMessage = document.getElementById('bidMessage'); if (bidMessage) bidMessage.textContent = ''; currentListingId = null; }

function submitBid() {
    if (!currentUser) { alert('Log in to place a bid'); return; } if (currentUser.banned) { showBanOverlay(currentUser.reason); closeBidModal(); return; } if (!currentUser.roblox_verified) { alert('Verify Roblox account first.'); showRobloxVerificationOverlay(); closeBidModal(); return; }
    if (!currentListingId) { alert('No auction selected'); return; }
    const bidAmountInput = document.getElementById('bidAmount'), messageBox = document.getElementById('bidMessage');
    const bidAmountRaw = bidAmountInput ? bidAmountInput.value : '0';
    if (!bidAmountRaw || isNaN(parseFloat(bidAmountRaw)) || parseFloat(bidAmountRaw) <= 0) { messageBox.textContent = 'Enter a valid bid amount.'; messageBox.style.color = 'red'; return; }
    const bidAmount = parseFloat(bidAmountRaw);
    if (bidAmount < 0) { messageBox.textContent = 'Bid amount cannot be negative.'; messageBox.style.color = 'red'; return; }

    toggleLoadingIndicator(true); messageBox.textContent = 'Submitting bid...'; messageBox.style.color = '#3498db';
    fetch(`/api/market/bid/${currentListingId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bid_amount: bidAmount }), credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); else { messageBox.textContent = escapeHTML(data.error) || "Permission denied."; messageBox.style.color = 'red';} return Promise.reject(new Error("Permission or Ban error")); }); if (!response.ok) return response.json().then(data => Promise.reject(data.error || `HTTP error ${response.status}`)); return response.json(); })
    .then(data => { toggleLoadingIndicator(false); if (data.error) { messageBox.textContent = escapeHTML(data.error); messageBox.style.color = 'red'; } else { messageBox.textContent = 'Bid placed successfully!'; messageBox.style.color = 'green'; if (data.new_end_time) messageBox.textContent += ' Auction time extended.'; setTimeout(() => { closeBidModal(); refreshAuctions(); refreshListings(); }, 2000); } })
    .catch(error => { if(error.message !== "Permission or Ban error") { console.error('Error:', error); messageBox.textContent = `Error placing bid: ${escapeHTML(error.message || error)}`; messageBox.style.color = 'red'; } toggleLoadingIndicator(false); });
}

function refreshAuctions() {
    toggleLoadingIndicator(true);
    fetch('/api/market/listings?type=auction', { credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); }); if (!response.ok) throw new Error(`HTTP error ${response.status}`); return response.json(); })
    .then(data => { currentAuctions = {}; for (const id in data) if (data[id].status === 'active') currentAuctions[id] = data[id]; renderFilteredAndSortedAuctions(); toggleLoadingIndicator(false); })
    .catch(error => { if(error.message !== "Banned user") {console.error('Error fetching auctions:', error); const auctionsContainer = document.getElementById('auctionsContainer'); if(auctionsContainer) auctionsContainer.innerHTML = `<div class="empty-state"><p>Error loading auctions.</p></div>`;} toggleLoadingIndicator(false); });
}

function filterAuctions() { renderFilteredAndSortedAuctions(); }

function refreshServers() {
    toggleLoadingIndicator(true);
    fetch('/api/market/servers', { credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); }); if (!response.ok) throw new Error(`HTTP error ${response.status}`); return response.json(); })
    .then(data => { displayServers(data); toggleLoadingIndicator(false); })
    .catch(error => { if(error.message !== "Banned user") {console.error('Error:', error); const serversContainer = document.getElementById('serversContainer'); if(serversContainer) serversContainer.innerHTML = `<div class="empty-state"><p>Error loading servers.</p></div>`;} toggleLoadingIndicator(false); });
}

function displayServers(servers) {
    const container = document.getElementById('serversContainer'); if (!container) return;
    if (servers.length === 0) { container.innerHTML = `<div class="empty-state"><img src="/static/images/robo_cub_placeholder.png" alt="Server"><p>No servers available</p></div>`; return; }
    let html = '<div class="servers-grid">';
    servers.forEach(server => { html += `<div class="server-card"><div class="server-header"><h3>${escapeHTML(server.name)}</h3></div><div class="server-body"></div><div class="server-footer"><button onclick="joinServer('${escapeHTML(server.server_url)}')" class="join-button">Join Server</button></div></div>`; });
    html += '</div>'; container.innerHTML = html;
}

function joinServer(serverUrl) { if (currentUser && currentUser.banned) { showBanOverlay(currentUser.reason); return; } if (serverUrl && (serverUrl.startsWith('http://') || serverUrl.startsWith('https://') || serverUrl.startsWith('roblox://'))) window.open(serverUrl, '_blank'); else alert('Invalid server URL.'); }

function viewListingDetails(listingId) {
    const modal = document.getElementById('listingModal'), listingDetailsDiv = document.getElementById('listingDetails'); if(!modal || !listingDetailsDiv) return;
    toggleLoadingIndicator(true);
    fetch(`/api/market/listings/${listingId}`, { credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); }); if (!response.ok) return response.json().then(data => Promise.reject(data.error || `HTTP error ${response.status}`)); return response.json(); })
    .then(listing => {
        toggleLoadingIndicator(false); if (listing.error) { alert(`Error fetching listing: ${escapeHTML(listing.error)}`); return; }
        const listingType = listing.listing_type, typeLabel = listingType === 'sell' ? 'Selling' : listingType === 'buy' ? 'Looking For' : 'Auction';
        let modalImageHtml = listing.image_url ? `<div class="listing-modal-image-container"><img src="${escapeHTML(listing.image_url)}" alt="Listing image" class="listing-modal-image" onclick="openImageModal('${escapeHTML(listing.image_url)}')"></div>` : '';
        const lookingForText = listing.looking_for ? escapeHTML(listing.looking_for) : '<em>Not specified</em>';
        const sellerDisplayName = listing.display_name || listing.discord_username || "Unknown Seller", currentBidderDisplayName = listing.current_bidder_display_name || "No bids yet";
        let actionsHtml = '';
        if (listingType === 'auction' && listing.status === 'active') {
            actionsHtml += `<button onclick="openBidModal('${listingId}')" class="bid-button action-btn">Place Bid</button>`;
        } else {
            actionsHtml += `<button onclick="initiateChatFromListing('${listing.discord_id}', '${escapeHTML(listing.discord_username)}', '${escapeHTML(listing.avatar) || ''}')" class="contact-button action-btn">Contact Seller</button>`;
        }
        actionsHtml += `<button onclick="openReportModal('${listingId}')" class="report-button action-btn">Report</button>`;
        if (currentUser && (currentUser.is_admin || currentUser.is_moderator) && currentUser.discord_id !== listing.discord_id) actionsHtml += `<button onclick="moderatorDeleteListing('${listingId}')" class="delete-button action-btn" style="background-color: var(--accent-color); margin-top: 5px;">Delete Listing (Mod)</button>`;
        let html = `<h2>${escapeHTML(typeLabel)}: ${escapeHTML(listing.items)}</h2><div class="listing-details-content"><div class="listing-modal-text-content"><div class="listing-info"><p><strong>Posted by:</strong> ${escapeHTML(sellerDisplayName)}</p><p><strong>Posted on:</strong> ${formatDate(listing.created_at)}</p>`;
        if (listingType === 'auction') { html += `<p><strong>Current Bid:</strong> ${escapeHTML(String(listing.current_bid))} Signs</p><p><strong>Current Bidder:</strong> ${escapeHTML(currentBidderDisplayName)}</p><p><strong>Ends:</strong> ${formatTimeRemaining(listing.auction_end)}</p>`; if (listing.bid_history && listing.bid_history.length > 0) { html += `<p><strong>Bid History:</strong></p><ul class="bid-history">`; listing.bid_history.slice().reverse().forEach(bid => { const bidderNameForHistory = bid.bidder_display_name || bid.bidder_discord_username || "Unknown Bidder"; html += `<li>${escapeHTML(bidderNameForHistory)}: ${escapeHTML(String(bid.amount))} Signs (${formatDate(bid.time)})</li>`; }); html += `</ul>`; } }
        else html += `<p><strong>Price:</strong> ${listing.price ? escapeHTML(String(listing.price)) : 'Negotiable'} Signs</p>`;
        html += `<p><strong>Looking For:</strong> ${lookingForText}</p></div><div class="listing-actions">${actionsHtml}</div></div>${modalImageHtml}</div>`;
        listingDetailsDiv.innerHTML = html; modal.style.display = 'block';
    })
    .catch(error => { toggleLoadingIndicator(false); if(error.message !== "Banned user") { console.error("Error fetching listing details:", error); alert(`Could not load listing: ${escapeHTML(error.message || error)}`);} });
}

function moderatorDeleteListing(listingId) {
    if (!currentUser || (!currentUser.is_admin && !currentUser.is_moderator)) { alert('Permission denied.'); return; } if (currentUser.banned) { showBanOverlay(currentUser.reason); return; }
    const listingToDelete = currentListings[listingId] || currentAuctions[listingId]; let confirmMessage = `Are you sure you want to delete this listing: "${listingToDelete ? escapeHTML(listingToDelete.items) : 'Unknown Item'}"? This action is irreversible.`;
    if (listingToDelete && listingToDelete.listing_type === 'auction' && listingToDelete.status === 'active' && listingToDelete.current_bidder_id) confirmMessage += "\n\n⚠️ This is an active auction with bids. Deleting it will cancel the auction.";
    if (!confirm(confirmMessage)) return;
    toggleLoadingIndicator(true);
    fetch(`/api/market/listings/${listingId}`, { method: 'DELETE', credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error(data.error || "Permission or Ban error")); }); if (!response.ok) return response.json().then(data => Promise.reject(data.error || `HTTP error ${response.status}`)); return response.json(); })
    .then(data => { toggleLoadingIndicator(false); if (data.error) alert(`Error deleting listing: ${escapeHTML(data.error)}`); else { alert('Listing deleted successfully by moderator/admin.'); closeListingModal(); if (document.getElementById('BrowseListings').style.display === 'block') refreshListings(); if (document.getElementById('Auctions').style.display === 'block') refreshAuctions(); if (document.getElementById('MyListings').style.display === 'block') loadMyListings(); } })
    .catch(error => { toggleLoadingIndicator(false); console.error('Error deleting listing by mod/admin:', error); alert(`Error during deletion: ${escapeHTML(error.message || error)}`); });
}

function closeListingModal() { const modal = document.getElementById('listingModal'); if (modal) modal.style.display = 'none'; }
function openImageModal(imageUrl) { const modal = document.getElementById('imageZoomModal'), imgElement = document.getElementById('zoomedImage'); if (modal && imgElement) { imgElement.src = imageUrl; modal.style.display = 'block'; } }
function closeImageModal() { const modal = document.getElementById('imageZoomModal'); if (modal) { modal.style.display = 'none'; const imgElement = document.getElementById('zoomedImage'); if (imgElement) imgElement.src = ""; } }
function openReportModal(listingId) {
    if (!currentUser) { alert('Log in to report'); return; } if (currentUser.banned) { showBanOverlay(currentUser.reason); return; }
    const modal = document.getElementById('reportModal'), listing = currentListings[listingId] || currentAuctions[listingId];
    if (!listing) { alert('Listing not found'); return; } currentReportedListingId = listingId;
    document.getElementById('reportReason').value = ''; document.getElementById('reportMessage').textContent = ''; modal.style.display = 'block';
}
function closeReportModal() { const modal = document.getElementById('reportModal'); if (modal) modal.style.display = 'none'; currentReportedListingId = null; }
function submitReport() {
    if (!currentReportedListingId || !currentUser) { alert('Something went wrong'); return; } if (currentUser.banned) { showBanOverlay(currentUser.reason); closeReportModal(); return; }
    const reason = document.getElementById('reportReason').value.trim(), messageBox = document.getElementById('reportMessage');
    if (!reason) { messageBox.textContent = 'Provide a reason'; messageBox.style.color = 'red'; return; }
    const now = new Date().getTime(); const lastReportTime = parseInt(sessionStorage.getItem('lastReportTime') || '0');
    if (now - lastReportTime < REPORT_RATE_LIMIT_SECONDS_CLIENT_SIDE * 1000) { const remaining = Math.ceil((REPORT_RATE_LIMIT_SECONDS_CLIENT_SIDE * 1000 - (now - lastReportTime)) / 1000); messageBox.textContent = `Please wait ${Math.floor(remaining/60)}m ${remaining%60}s to report again.`; messageBox.style.color = 'red'; return; }
    toggleLoadingIndicator(true); messageBox.textContent = 'Submitting...'; messageBox.style.color = '#3498db';
    fetch('/api/market/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listing_id: currentReportedListingId, reason: reason }), credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); }); if (!response.ok) return response.json().then(data => Promise.reject(data.error || `HTTP error ${response.status}`)); return response.json(); })
    .then(data => { toggleLoadingIndicator(false); if (data.error) { messageBox.textContent = escapeHTML(data.error); messageBox.style.color = 'red'; } else { messageBox.textContent = 'Report submitted!'; messageBox.style.color = 'green'; sessionStorage.setItem('lastReportTime', new Date().getTime().toString()); setTimeout(closeReportModal, 3000); } })
    .catch(error => { if(error.message !== "Banned user") {console.error('Error:', error); messageBox.textContent = `Error submitting: ${escapeHTML(error.message || error)}`; messageBox.style.color = 'red';} toggleLoadingIndicator(false); });
}

function refreshReports() {
    if (!currentUser || (!currentUser.is_admin && !currentUser.is_moderator) ) return; if (currentUser.banned) { showBanOverlay(currentUser.reason); return; }
    const container = document.getElementById('reportsAdminContainer'); if (!container) return;
    toggleLoadingIndicator(true); container.innerHTML = "Loading reports...";
    fetch('/api/admin/reports', { credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); }); if (!response.ok) throw new Error(`HTTP error ${response.status}`); return response.json(); })
    .then(data => { displayReports(data, container); toggleLoadingIndicator(false); })
    .catch(error => { if(error.message !== "Banned user") {console.error('Error:', error); container.innerHTML = `<div class="empty-state"><p>Error loading reports.</p></div>`;} toggleLoadingIndicator(false); });
}

function displayReports(reports, container) {
    if (reports.length === 0) { container.innerHTML = `<div class="empty-state"><p>No reported listings</p></div>`; return; }
    const sortedReports = reports.sort((a, b) => new Date(b.reported_at) - new Date(a.reported_at)); let html = '<div class="reports-list">';
    sortedReports.forEach(report => { if (report.status !== 'pending') return; const safeReportId = escapeHTML(report.id), safeStatus = escapeHTML(report.status), safeReporterName = escapeHTML(report.reporter_name), safeListingId = escapeHTML(report.listing_id), safeReason = escapeHTML(report.reason); html += `<div class="report-card" data-id="${safeReportId}"><div class="report-header"><h4>Report #${safeReportId.substring(0, 8)}</h4><span class="report-status status-${safeStatus}">${safeStatus}</span></div><div class="report-body"><p><strong>Reported by:</strong> ${safeReporterName}</p><p><strong>On:</strong> ${formatDate(report.reported_at)}</p><p><strong>Listing ID:</strong> ${safeListingId}</p><p><strong>Reason:</strong> ${safeReason}</p></div><div class="report-actions"><button onclick="viewReportedListing('${safeListingId}')" class="view-button">View Listing</button><button onclick="resolveReport('${safeReportId}', 'resolved', true)" class="resolve-button">Remove Listing</button><button onclick="resolveReport('${safeReportId}', 'resolved', false)" class="resolve-button">Resolve (Keep)</button><button onclick="resolveReport('${safeReportId}', 'rejected', false)" class="reject-button">Reject Report</button></div></div>`; });
    html += '</div>'; container.innerHTML = html;
}

function viewReportedListing(listingId) {
    if (currentUser && currentUser.banned) { showBanOverlay(currentUser.reason); return; }
    toggleLoadingIndicator(true);
    fetch(`/api/market/listings/${listingId}`, { credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); }); if (!response.ok) return response.json().then(data => Promise.reject(data.error || `HTTP error ${response.status}`)); return response.json(); })
    .then(data => { toggleLoadingIndicator(false); if (data.error) alert(escapeHTML(data.error)); else { const tempStore = {}; tempStore[listingId] = data; if (currentListings[listingId]) currentListings[listingId] = data; if (currentAuctions[listingId]) currentAuctions[listingId] = data; viewListingDetails(listingId); } })
    .catch(error => { if(error.message !== "Banned user") {console.error('Error:', error); alert(`Error fetching: ${escapeHTML(error.message || error)}`);} toggleLoadingIndicator(false); });
}

function resolveReport(reportId, status, removeListing) {
    if (!currentUser || (!currentUser.is_admin && !currentUser.is_moderator)) { alert('Admins/Mods only'); return; } if (currentUser.banned) { showBanOverlay(currentUser.reason); return; }
    if (!confirm(`Resolve report as "${escapeHTML(status)}"? ${removeListing ? "(Listing will be removed)" : ""}`)) return;
    toggleLoadingIndicator(true);
    fetch(`/api/admin/reports/${reportId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: status, action: removeListing ? 'remove' : 'keep' }), credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); }); if (!response.ok) return response.json().then(data => Promise.reject(data.error || `HTTP error ${response.status}`)); return response.json(); })
    .then(data => { toggleLoadingIndicator(false); if (data.error) alert(escapeHTML(data.error)); else { alert(`Report ${escapeHTML(status)}`); refreshReports(); } })
    .catch(error => { if(error.message !== "Banned user") {console.error('Error:', error); alert(`Error updating: ${escapeHTML(error.message || error)}`);} toggleLoadingIndicator(false); });
}

function refreshAdminServers() {
    if (!currentUser || (!currentUser.is_admin && !currentUser.is_moderator)) return; if (currentUser.banned) { showBanOverlay(currentUser.reason); return; }
    const container = document.getElementById('adminServersManageContainer'); if(!container) return;
    toggleLoadingIndicator(true); container.innerHTML = "Loading servers...";
    fetch('/api/market/servers', { credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); }); if (!response.ok) throw new Error(`HTTP error ${response.status}`); return response.json(); })
    .then(data => { displayAdminServers(data, container); toggleLoadingIndicator(false); })
    .catch(error => { if(error.message !== "Banned user") {console.error('Error:', error); container.innerHTML = `<div class="empty-state"><p>Error loading servers.</p></div>`;} toggleLoadingIndicator(false); });
}

function displayAdminServers(servers, container) {
    if (servers.length === 0) { container.innerHTML = `<div class="empty-state"><p>No servers found</p></div>`; return; }
    let html = '<div class="admin-servers-list">';
    servers.forEach(server => html += `<div class="admin-server-card" data-id="${server.id}"><div class="admin-server-header"><h4>${escapeHTML(server.name)}</h4></div><div class="admin-server-body"><p><strong>URL:</strong> ${escapeHTML(server.server_url)}</p><p><strong>Added by:</strong> ${escapeHTML(server.added_by) || 'Unknown'} on ${formatDate(server.added_at)}</p></div><div class="admin-server-actions"><button onclick="deleteAdminServer('${server.id}')" class="delete-button">Delete</button></div></div>`);
    html += '</div>'; container.innerHTML = html;
}

function addAdminServer() {
    if (!currentUser || (!currentUser.is_admin && !currentUser.is_moderator)) { alert('Admins/Mods only'); return; } if (currentUser.banned) { showBanOverlay(currentUser.reason); return; }
    const serverName = document.getElementById('newServerName').value.trim(), serverUrl = document.getElementById('newServerUrl').value.trim(), serverStatus = document.getElementById('newServerStatus').value.trim(), messageBox = document.getElementById('addServerMessage');
    if (!serverName || !serverUrl) { messageBox.textContent = 'Name and URL required'; messageBox.style.color = 'red'; return; }
    toggleLoadingIndicator(true); messageBox.textContent = "Adding..."; messageBox.style.color = '#3498db';
    fetch('/api/market/servers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: serverName, server_url: serverUrl, status: serverStatus || '0/6 players' }), credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); }); if (!response.ok) return response.json().then(data => Promise.reject(data.error || `HTTP error ${response.status}`)); return response.json(); })
    .then(data => { toggleLoadingIndicator(false); if (data.error) { messageBox.textContent = escapeHTML(data.error); messageBox.style.color = 'red';} else { messageBox.textContent = 'Server added!'; messageBox.style.color = 'green'; document.getElementById('newServerName').value = ''; document.getElementById('newServerUrl').value = ''; document.getElementById('newServerStatus').value = '0/6 players'; refreshAdminServers(); refreshServers(); } })
    .catch(error => { if(error.message !== "Banned user") {console.error('Error:', error); messageBox.textContent = `Error adding: ${escapeHTML(error.message || error)}`; messageBox.style.color = 'red';} toggleLoadingIndicator(false); });
}

function deleteAdminServer(serverId) {
    if (!currentUser || (!currentUser.is_admin && !currentUser.is_moderator)) { alert('Admins/Mods only'); return; } if (currentUser.banned) { showBanOverlay(currentUser.reason); return; }
    if (!confirm('Delete this server?')) return;
    toggleLoadingIndicator(true);
    fetch(`/api/market/servers/${serverId}`, { method: 'DELETE', credentials: 'include' })
    .then(response => { if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); }); if (!response.ok) return response.json().then(data => Promise.reject(data.error || `HTTP error ${response.status}`)); return response.json(); })
    .then(data => { toggleLoadingIndicator(false); if (data.error) alert(escapeHTML(data.error)); else { alert('Server deleted'); refreshAdminServers(); refreshServers(); } })
    .catch(error => { if(error.message !== "Banned user") {console.error('Error:', error); alert(`Error deleting: ${escapeHTML(error.message || error)}`);} toggleLoadingIndicator(false); });
}

function showValueListSelectionScreen() {
    const selectionContainer = document.getElementById('valueListSelectionContainer'), stickerContent = document.getElementById('stickerValueListContent'), beequipContent = document.getElementById('beequipValueListContent'), stickerSearchBar = document.getElementById('searchBar');
    if (selectionContainer) selectionContainer.style.display = 'flex'; if (stickerContent) stickerContent.style.display = 'none'; if (beequipContent) beequipContent.style.display = 'none'; if(stickerSearchBar) stickerSearchBar.style.display = 'none';
}
function showStickerValueList() {
    const selectionContainer = document.getElementById('valueListSelectionContainer'), stickerContent = document.getElementById('stickerValueListContent'), beequipContent = document.getElementById('beequipValueListContent'), searchBar = document.getElementById('searchBar');
    if (selectionContainer) selectionContainer.style.display = 'none'; if (stickerContent) stickerContent.style.display = 'block'; if (beequipContent) beequipContent.style.display = 'none'; if (searchBar) searchBar.style.display = 'block';
}
function showBeequipValueList() {
    const selectionContainer = document.getElementById('valueListSelectionContainer');
    const stickerContent = document.getElementById('stickerValueListContent');
    const beequipContent = document.getElementById('beequipValueListContent');
    const searchBar = document.getElementById('searchBar');

    if (selectionContainer) selectionContainer.style.display = 'none';
    if (stickerContent) stickerContent.style.display = 'none';
    if (beequipContent) beequipContent.style.display = 'block';
    if (searchBar) searchBar.style.display = 'none';

    showBeequipSelectionView();
}

function getBeequipDisplayImage(itemData) { if (itemData && itemData.image && itemData.image.trim() !== '') return itemData.image; else if (itemData && itemData.group_ref && valueList[itemData.group_ref] && valueList[itemData.group_ref].image && valueList[itemData.group_ref].image.trim() !== '') return valueList[itemData.group_ref].image; return 'https://via.placeholder.com/50?text=?'; }

function renderBeequipSelectionGrid() {
    const gridContainer = document.getElementById('beequipSelectionGrid');
    if (!gridContainer) { console.error("Beequip selection grid container not found."); return; }
    gridContainer.innerHTML = '';

    const beequipGroups = {};
    const standaloneBeequips = {};

    for (const key in valueList) {
        const item = valueList[key];
        if (item && item.category === "Beequip Group") {
            beequipGroups[key] = { ...item, key: key, children: [] };
        }
    }
    for (const key in valueList) {
        const item = valueList[key];
        if (item && item.category === "Beequip") {
            if (item.group_ref && beequipGroups[item.group_ref]) {
                beequipGroups[item.group_ref].children.push({ ...item, key: key });
            } else {
                standaloneBeequips[key] = { ...item, key: key };
            }
        }
    }

    const sortedGroupKeys = Object.keys(beequipGroups).sort((a, b) => a.localeCompare(b));

    sortedGroupKeys.forEach(groupKey => {
        const group = beequipGroups[groupKey];
        const card = document.createElement('div');
        card.className = 'beequip-selection-card';
        const groupImage = getBeequipDisplayImage(group);
        card.innerHTML = `<img src="${escapeHTML(groupImage)}" alt="${escapeHTML(group.key)}" onerror="this.src='https://via.placeholder.com/80?text=?';"><h4>${escapeHTML(group.key)}</h4>`;
        card.onclick = () => showBeequipVariants(group.key, group.key, groupImage);
        gridContainer.appendChild(card);
    });

    const sortedStandaloneKeys = Object.keys(standaloneBeequips).sort((a, b) => a.localeCompare(b));
    sortedStandaloneKeys.forEach(itemKey => {
        const item = standaloneBeequips[itemKey];
        const card = document.createElement('div');
        card.className = 'beequip-selection-card';
        const itemImage = getBeequipDisplayImage(item);
        card.innerHTML = `<img src="${escapeHTML(itemImage)}" alt="${escapeHTML(item.key)}" onerror="this.src='https://via.placeholder.com/80?text=?';"><h4>${escapeHTML(item.key)}</h4>`;
        card.onclick = () => openBeequipModal(item.key, itemImage);
        gridContainer.appendChild(card);
    });
}

function showBeequipVariants(groupKey, groupName, groupImage) {
    currentBeequipGroupKey = groupKey;
    currentBeequipSubgroupKey = null;
    const selectionView = document.getElementById('beequipSelectionView');
    const variantView = document.getElementById('beequipVariantView');
    const titleEl = document.getElementById('beequipVariantListTitle');
    const searchInput = document.getElementById('beequipSearchBar');
    const backBtn = document.getElementById('backToBeequipSelectionBtn');
    const sortSelect = document.getElementById('beequipSortBy');

    if (!selectionView || !variantView || !titleEl || !searchInput) return;

    selectionView.style.display = 'none';
    variantView.style.display = 'block';
    if(backBtn) backBtn.textContent = '← Back to Beequips';
    if(searchInput) searchInput.value = '';
    if(sortSelect) sortSelect.value = currentBeequipSortCriteria;

    titleEl.innerHTML = `<img src="${escapeHTML(groupImage)}" alt="${escapeHTML(groupName)}"> ${escapeHTML(groupName)}`;
    renderBeequipVariantList(groupKey);
}

function renderBeequipVariantList(groupKey) {
    const listEl = document.getElementById('beequipVariantList');
    if (!listEl) return;
    listEl.innerHTML = '';

    const variants = [];
    for (const key in valueList) {
        const item = valueList[key];
        if (item && item.category === "Beequip" && item.group_ref === groupKey) {
            variants.push({ ...item, key: key });
        }
    }
    
    const subgroups = {};
    variants.forEach(variant => {
        const subgroupName = getBeequipSubgroupName(variant.key, groupKey);
        if (!subgroups[subgroupName]) {
            subgroups[subgroupName] = {
                name: subgroupName,
                count: 0,
                image: getBeequipDisplayImage(variant)
            };
        }
        subgroups[subgroupName].count++;
    });

    if (!currentBeequipSubgroupKey && (Object.keys(subgroups).length > 1 || (Object.keys(subgroups).length === 1 && subgroups[Object.keys(subgroups)[0]].count > 8))) {
        const sortedSubgroups = Object.values(subgroups).sort((a,b) => a.name.localeCompare(b.name));

        sortedSubgroups.forEach(subgroup => {
            const li = document.createElement('li');
            li.className = 'value-item beequip-subgroup-item';
            li.onclick = () => {
                currentBeequipSubgroupKey = subgroup.name;
                const backBtn = document.getElementById('backToBeequipSelectionBtn');
                if(backBtn) backBtn.textContent = '← Back to Sub-groups';
                renderBeequipVariantList(groupKey);
            };
            li.innerHTML = `<img src="${escapeHTML(subgroup.image)}" alt="${escapeHTML(subgroup.name)}" onerror="this.src='https://via.placeholder.com/50?text=?';">
                          <span>${escapeHTML(subgroup.name)}</span>
                          <div class="value-display">${subgroup.count} variants</div>`;
            listEl.appendChild(li);
        });
    } else {
        let itemsToRender = variants;
        if (currentBeequipSubgroupKey) {
            itemsToRender = variants.filter(variant => getBeequipSubgroupName(variant.key, groupKey) === currentBeequipSubgroupKey);
        }
        
        const getSortableValue = (item) => {
            return item.graph_value !== null && typeof item.graph_value !== 'undefined' ? item.graph_value : -1;
        };
        
        itemsToRender.sort((a, b) => {
            switch (currentBeequipSortCriteria) {
                case 'value_asc':
                    return getSortableValue(a) - getSortableValue(b);
                case 'name_asc':
                    return a.key.localeCompare(b.key);
                case 'name_desc':
                    return b.key.localeCompare(a.key);
                case 'value_desc':
                default:
                    return getSortableValue(b) - getSortableValue(a);
            }
        });

        itemsToRender.forEach(variant => {
            const displayValue = formatValueDisplay(variant.value_min, variant.value_max, variant.graph_value);
            const itemImage = getBeequipDisplayImage(variant);
            let displayName = variant.key;
            if (displayName.toLowerCase().startsWith(groupKey.toLowerCase())) {
                displayName = displayName.substring(groupKey.length).trim();
                if (!displayName) displayName = variant.key;
            }

            const li = document.createElement('li');
            li.className = 'value-item';
            li.dataset.name = variant.key;
            li.onclick = () => openBeequipModal(variant.key, itemImage);
            li.innerHTML = `<img src="${escapeHTML(itemImage)}" alt="${escapeHTML(variant.key)}" onerror="this.src='https://via.placeholder.com/50?text=?';"><span>${escapeHTML(displayName)}</span><div class="value-display">${displayValue}</div>`;
            listEl.appendChild(li);
        });
    }
}

function showBeequipSelectionView() {
    currentBeequipGroupKey = null;
    currentBeequipSubgroupKey = null;
    const selectionView = document.getElementById('beequipSelectionView');
    const variantView = document.getElementById('beequipVariantView');
    
    const globalSearchInput = document.getElementById('globalBeequipSearchBar');
    if (globalSearchInput) {
        globalSearchInput.value = '';
        handleGlobalBeequipSearch(); 
    }

    const contextualSearchInput = document.getElementById('beequipSearchBar');
    const contextualResults = document.getElementById('beequipSearchResults');
    if (contextualSearchInput) contextualSearchInput.value = '';
    if (contextualResults) contextualResults.style.display = 'none';
    
    if (selectionView) selectionView.style.display = 'block';
    if (variantView) variantView.style.display = 'none';
}

function searchBeequips() {
    const searchInput = document.getElementById('beequipSearchBar');
    const searchResultsContainer = document.getElementById('beequipSearchResults');
    const variantList = document.getElementById('beequipVariantList');
    const variantTitle = document.getElementById('beequipVariantListTitle');
    const backBtn = document.getElementById('backToBeequipSelectionBtn');

    if (!searchInput || !searchResultsContainer || !variantList || !variantTitle || !backBtn) return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    searchResultsContainer.innerHTML = '';
    
    if (searchTerm.length < 1) {
        // Search cleared: restore the variant list view
        searchResultsContainer.style.display = 'none';
        variantList.style.display = 'block';
        variantTitle.style.display = 'flex';
        // Restore back button text based on context
        if (currentBeequipSubgroupKey) {
            backBtn.textContent = '← Back to Sub-groups';
        } else {
            backBtn.textContent = '← Back to Beequips';
        }
        return;
    }
    
    // Search active: hide variant list and title, show search results container.
    variantList.style.display = 'none';
    variantTitle.style.display = 'none';
    searchResultsContainer.style.display = 'block';
    
    // Change back button text to indicate it will exit the search context
    backBtn.textContent = '← Exit Search';

    const searchableBeequips = [];
    for (const itemKey in valueList) {
        const item = valueList[itemKey];
        const categoryLower = (item.category || '').toLowerCase();
        if (categoryLower.includes('beequip') && !categoryLower.includes('group')) {
            const groupName = item.group_ref && valueList[item.group_ref] ? valueList[item.group_ref].key : null;
            searchableBeequips.push({
                key: itemKey,
                name: itemKey,
                value_min: item.value_min,
                value_max: item.value_max,
                graph_value: item.graph_value,
                image: getBeequipDisplayImage(item),
                groupName: groupName
            });
        }
    }

    const fuseOptions = { keys: ['name', 'groupName'], threshold: 0.4, distance: 80, minMatchCharLength: 1 };
    const fuse = new Fuse(searchableBeequips, fuseOptions);
    const results = fuse.search(searchTerm);

    if (results.length > 0) {
        // Clear previous results and add the header
        resultsContainer.innerHTML = '<h4>Search Results (Beequips)</h4>';
        
        const ul = document.createElement('ul');
        ul.className = 'value-list';
        results.forEach(result => {
            const item = result.item;
            const li = document.createElement('li');
            li.className = 'value-item search-item';
            li.onclick = () => {
                openBeequipModal(item.key, item.image);
                searchInput.value = '';
                handleGlobalBeequipSearch();
            };
            const displayValue = formatValueDisplay(item.value_min, item.value_max, item.graph_value);
            let displayName = item.key;
            if (item.groupName && item.key.toLowerCase().startsWith(item.groupName.toLowerCase())) {
                displayName = item.key.substring(item.groupName.length).trim();
            }
            if (!displayName) displayName = item.key;
            
            li.innerHTML = `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.key)}" onerror="this.src='https://via.placeholder.com/50?text=?';"><span>${escapeHTML(displayName)} ${item.groupName ? `<em>(${escapeHTML(item.groupName)})</em>` : ''}</span><div class="value-display">${displayValue}</div>`;
            ul.appendChild(li);
        });
        resultsContainer.appendChild(ul); // Append the list after the header
    } else {
        searchResultsContainer.innerHTML = '<p style="text-align:center; padding:10px;">No beequips found matching that search.</p>';
    }
}

function openBeequipModal(itemName, itemImageFromDOM) {
    currentOpenModalItemName = itemName;
    var modal = document.getElementById("itemModal");
    if (!modal) { console.error("itemModal not found!"); return; }
    var modalContent = modal.querySelector(".modal-content");
    if (!modalContent) { console.error("modal-content not found in itemModal!"); return; }
    const beequipData = valueList[itemName] || {};
    const { value_min: valueMin, value_max: valueMax, graph_value: graphValue, demand, acronyms } = beequipData;
        
    let displayImage = itemImageFromDOM;
    if (displayImage === 'https://via.placeholder.com/50?text=?') displayImage = 'https://via.placeholder.com/80x80.png?text=?';
    
    let demandHtml = '';
    if (demand !== null && typeof demand !== 'undefined') {
        demandHtml = `<p>Demand: <strong>${escapeHTML(String(demand))}/5</strong></p>`;
    }
    
    modalContent.innerHTML = `<span class="close" onclick="closeItemModal()">×</span><div style="display: flex; align-items: center; margin-bottom: 15px;"><img src="${escapeHTML(displayImage)}" alt="${escapeHTML(itemName)}" style="max-width: 80px; max-height: 80px; margin-right: 15px; border-radius: 5px; object-fit: contain;" onerror="this.src='https://via.placeholder.com/80x80.png?text=?';"><h2 id="modalTitle">${escapeHTML(itemName)}</h2></div><p>Current Value: <strong><span id="modalCurrentValueDisplay"></span></strong></p>${demandHtml}<p>Category: ${escapeHTML(beequipData.category) || 'Beequip'}</p><canvas id="priceChart"></canvas>`;

    const valueDisplaySpan = modalContent.querySelector("#modalCurrentValueDisplay");
    if (valueDisplaySpan) {
        const displayValueStr = formatValueDisplay(valueMin, valueMax, graphValue, true);
        valueDisplaySpan.innerHTML = displayValueStr;
    }
    
    if (currentUser && currentUser.is_admin) {
        const adminControls = document.createElement('div');
        adminControls.className = 'admin-edit-controls';
        const adminEditImageUrl = beequipData.image || '';
        const adminDemandValue = demand !== null && typeof demand !== 'undefined' ? demand : '';
        adminControls.innerHTML = `<h4>Admin Edit</h4><div class="form-group"><label for="adminEditValueMin">Min Value:</label><input type="text" id="adminEditValueMin" value="${valueMin !== null ? valueMin : ''}" placeholder="Enter min value"></div><div class="form-group"><label for="adminEditValueMax">Max Value:</label><input type="text" id="adminEditValueMax" value="${valueMax !== null ? valueMax : ''}" placeholder="Enter max value"></div><div class="form-group"><label for="adminEditDemand">Demand (0-5):</label><input type="number" id="adminEditDemand" value="${adminDemandValue}" placeholder="e.g., 2.5" step="0.1" min="0" max="5"></div><div class="form-group"><label for="adminEditAcronyms">Acronyms:</label><input type="text" id="adminEditAcronyms" value="${escapeHTML(acronyms || '')}" placeholder="comma,separated,list"></div><div class="form-group"><label for="adminEditImage">New Image URL (optional):</label><input type="text" id="adminEditImage" value="${escapeHTML(adminEditImageUrl)}" placeholder="Enter new image URL (leave blank to inherit from group if applicable)"></div><button onclick="saveItemValue('${escapeHTML(itemName)}', false)" class="admin-save-button">Save Changes</button><button onclick="deleteItemFromModal('${escapeHTML(itemName)}')" class="admin-delete-button" style="margin-left: 10px;">Delete Item</button><div id="adminEditMessage" class="message-box"></div>`;
        modalContent.appendChild(adminControls);
    }
    
    modal.style.display = "block";
    createPriceChart(itemName);
}

function saveItemValue(itemKey, hasChart) {
    if (!currentUser || !currentUser.is_admin) { alert('Unauthorized'); return; }
    if (currentUser.banned) { showBanOverlay(currentUser.reason); return; }
    const valueMinInput = document.getElementById('adminEditValueMin');
    const valueMaxInput = document.getElementById('adminEditValueMax');
    const newImageInput = document.getElementById('adminEditImage');
    const newDemandInput = document.getElementById('adminEditDemand');
    const newAcronymsInput = document.getElementById('adminEditAcronyms');
    const messageBox = document.getElementById('adminEditMessage');

    if (!valueMinInput || !valueMaxInput || !messageBox || !newDemandInput || !newAcronymsInput) {
        if (messageBox) {
            messageBox.textContent = 'Error: Form elements missing.';
            messageBox.style.color = 'red';
        }
        return;
    }
    
    const valueMinStr = valueMinInput.value.trim();
    const valueMaxStr = valueMaxInput.value.trim();
    const newDemandStr = newDemandInput.value.trim();
    const newAcronyms = newAcronymsInput.value.trim();

    const isValidValueString = (str) => {
        if (str === null || str === '') return true;
        const sanitized = str.replace(/\{[^}]+\}/g, '');
        if (/[a-zA-Z]/.test(sanitized)) {
            return false;
        }
        return true;
    };
    
    if (!isValidValueString(valueMinStr) || !isValidValueString(valueMaxStr)) {
        messageBox.textContent = "Invalid format. Letters are only allowed inside {} for item references.";
        messageBox.style.color = 'red';
        return;
    }

    const isMinNumericLooking = /^-?\d+(\.\d+)?$/.test(valueMinStr);
    const isMaxNumericLooking = /^-?\d+(\.\d+)?$/.test(valueMaxStr);

    if (valueMinStr && valueMaxStr && isMinNumericLooking && isMaxNumericLooking) {
        if (parseFloat(valueMinStr) > parseFloat(valueMaxStr)) {
            messageBox.textContent = 'Min value cannot be > Max value.';
            messageBox.style.color = 'red';
            return;
        }
    }

    let newDemand = null;
    if (newDemandStr !== '') {
        const parsedDemand = parseFloat(newDemandStr);
        if (isNaN(parsedDemand) || parsedDemand < 0 || parsedDemand > 5) {
            messageBox.textContent = 'Demand must be a number between 0 and 5.';
            messageBox.style.color = 'red';
            return;
        }
        newDemand = parsedDemand;
    }

    const newImage = newImageInput ? newImageInput.value.trim() : null;
    messageBox.textContent = 'Saving...';
    messageBox.style.color = '#3498db';
    toggleLoadingIndicator(true);
    
    const requestBody = {
        key: itemKey,
        value_min: valueMinStr,
        value_max: valueMaxStr,
        image: newImage,
        demand: newDemandStr === '' ? null : newDemand,
        acronyms: newAcronyms
    };

    fetch('/api/admin/item/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 403) return response.json().then(data => { if (data.error === "banned") showBanOverlay(data.reason); return Promise.reject(new Error("Banned user")); });
        if (!response.ok) return response.json().then(data => Promise.reject(data.error || `HTTP error ${response.status}`));
        return response.json();
    })
    .then(data => {
        if (data.error) {
            messageBox.textContent = `Error: ${escapeHTML(data.error)}`;
            messageBox.style.color = 'red';
        } else {
            messageBox.textContent = escapeHTML(data.message) || 'Updated!';
            messageBox.style.color = 'green';
            
            fetchValues().then(() => {
                if (currentOpenModalItemName === itemKey) {
                    const isBeequip = valueList[itemKey]?.category === 'Beequip';
                    closeItemModal();
                    if (isBeequip) {
                        const itemImage = getBeequipDisplayImage(valueList[itemKey]);
                        openBeequipModal(itemKey, itemImage);
                    } else {
                        openModal(itemKey);
                    }
                }
            });

            setTimeout(() => {
                const currentMessageBox = document.getElementById('adminEditMessage');
                if (currentMessageBox) currentMessageBox.textContent = '';
            }, 3000);
        }
    })
    .catch(error => {
        if(error.message !== "Banned user") {
            console.error('Error saving:', error);
            messageBox.textContent = `Error saving: ${escapeHTML(error.message || error)}`;
            messageBox.style.color = 'red';
        }
    })
    .finally(() => toggleLoadingIndicator(false));
}

function initializeChat() {
    if (!currentUser) return;
    if (currentUser.banned) { const chatLauncher = document.getElementById('chatLauncher'); if (chatLauncher) chatLauncher.style.display = 'none'; if(localStorage.getItem('bssmUserBanned') !== 'true') { localStorage.setItem('bssmUserBanned', 'true'); localStorage.setItem('bssmBanReason', currentUser.reason || "Access restricted for chat due to ban."); if (window.location.pathname !== '/banned-display-page') window.location.href = '/banned-display-page'; } return; }
    if (socket && socket.connected) return;
    socket = io({ autoConnect: true });
    socket.on('connect', () => { console.log('Chat connected:', socket.id); socket.emit('user_connected', { user_id: currentUser.discord_id }); loadConversations(); });
    socket.on('disconnect', (reason) => { console.log('Chat disconnected:', reason); });
    socket.on('connect_error', (err) => { console.error('Chat connection error:', err.message); });
    socket.on('force_disconnect_banned', (data) => { console.log("Received force_disconnect_banned from server:", data.reason); localStorage.setItem('bssmUserBanned', 'true'); localStorage.setItem('bssmBanReason', data.reason || "Account restricted due to ban."); showBanOverlay(data.reason || "Account restricted due to ban."); disconnectSocket(); if (window.location.pathname !== '/banned-display-page') window.location.href = '/banned-display-page'; });
    socket.on('message_error', (data) => { if (data.action === "set_ban_flag") { localStorage.setItem('bssmUserBanned', 'true'); localStorage.setItem('bssmBanReason', data.reason || "Banned from chat."); showBanOverlay(data.reason || "Banned from chat."); if (window.location.pathname !== '/banned-display-page') window.location.href = '/banned-display-page'; } else alert(`Chat Error: ${escapeHTML(data.error) || "Unknown error"}`); });
    socket.on('receive_message', (data) => { console.log('Message received:', data); appendMessageToWindow(data.sender_id, data, false); updateChatList(data.sender_id, data.sender_name, data.sender_avatar, data.content, true); updateTotalUnreadBadge(1); if (openChatWindows[data.sender_id]) socket.emit('mark_as_read', { conversation_with_id: data.sender_id }); });
    socket.on('receive_global_message', (data) => { appendMessageToWindow(GLOBAL_CHAT_ID, data, data.sender_id === currentUser.discord_id); });
    socket.on('chat_history', (data) => { const chatWindow = openChatWindows[data.other_user_id]; if (chatWindow) { const messagesDiv = chatWindow.querySelector('.chat-window-messages'); messagesDiv.innerHTML = ''; if (data.messages && data.messages.length > 0) data.messages.forEach(msg => { appendMessageToWindow(data.other_user_id, msg, msg.sender_id === currentUser.discord_id); }); else messagesDiv.innerHTML = '<p class="chat-placeholder" style="text-align:center; padding:10px; opacity:0.7;">No messages yet. Send one!</p>'; messagesDiv.scrollTop = messagesDiv.scrollHeight; } });
    socket.on('global_chat_history', (data) => { const chatWindow = openChatWindows[GLOBAL_CHAT_ID]; if (chatWindow) { const messagesDiv = chatWindow.querySelector('.chat-window-messages'); messagesDiv.innerHTML = ''; if (data.messages && data.messages.length > 0) data.messages.forEach(msg => { appendMessageToWindow(GLOBAL_CHAT_ID, msg, msg.sender_id === currentUser.discord_id); }); messagesDiv.scrollTop = messagesDiv.scrollHeight; } });
    
    // VVVVVV PASTE YOUR ENTIRE CODE BLOCK HERE VVVVVV
    socket.on('conversations_list', (conversations) => { chatConversations = conversations; const searchInput = document.getElementById('chatContactSearch'); if (!searchInput || !searchInput.value.trim()) renderChatListDOM(chatConversations); updateTotalUnreadBadge(0, true); conversations.forEach(convo => { if (convo.unread_count > 0) updateTotalUnreadBadge(convo.unread_count); }); });
    socket.on('unread_count_update', (data) => { if (typeof data.total_unread !== 'undefined') updateTotalUnreadBadge(data.total_unread, true); });
    socket.on('user_not_found', (data) => { alert(`User '${escapeHTML(data.username)}' not found or unavailable for chat.`); });
    socket.on('global_message_deleted', (data) => {
        const messageToRemove = document.querySelector(`.message[data-message-id="${data.message_id}"]`);
        if (messageToRemove) {
            messageToRemove.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            messageToRemove.style.opacity = '0';
            messageToRemove.style.transform = 'scale(0.9)';
            setTimeout(() => messageToRemove.remove(), 300);
        }
    });
}
function disconnectSocket() { if (socket) { socket.disconnect(); socket = null; console.log('Chat disconnected.'); } const chatList = document.getElementById('chatList'); if (chatList) chatList.innerHTML = '<p style="text-align:center;padding:10px;opacity:0.7;">Chat disconnected.</p>'; }
function toggleChatPanel(forceShow = null) {
    const panel = document.getElementById('chatPanel'); if (!panel) return; if (!currentUser || (currentUser && currentUser.banned)) { panel.style.display = 'none'; return; }
    const isVisible = panel.style.display === 'flex', shouldShow = forceShow !== null ? forceShow : !isVisible; panel.style.display = shouldShow ? 'flex' : 'none';
    if (shouldShow) { if (!socket || !socket.connected) initializeChat(); else { const searchInput = document.getElementById('chatContactSearch'); if (!searchInput || !searchInput.value.trim()) loadConversations(); } }
}
function loadConversations() { if (currentUser && currentUser.banned) return; const chatList = document.getElementById('chatList'); if (socket && socket.connected) socket.emit('request_conversations'); else if (chatList) chatList.innerHTML = '<p style="text-align:center;padding:10px;opacity:0.7;">Connecting to chat...</p>'; }

async function handleChatContactSearch() {
    const searchTerm = document.getElementById('chatContactSearch').value.trim(), chatListDiv = document.getElementById('chatList'); if (!chatListDiv) return;
    if (searchTerm.length < 2) { renderChatListDOM(chatConversations); return; } chatListDiv.innerHTML = '<p style="text-align:center;padding:10px;opacity:0.7;">Searching...</p>';
    try {
        const response = await fetch(`/api/chat/search_user?query=${encodeURIComponent(searchTerm)}`, { credentials: 'include' });
        if (!response.ok) { if (response.status === 403) { const data = await response.json(); if (data.error === "banned") { showBanOverlay(data.reason); return; } } throw new Error(`API Error: ${response.status}`); }
        const users = await response.json(); const formattedUsers = users.map(user => ({ other_user_id: user.discord_id, other_user_display_name: user.display_name, other_user_discord_name: user.discord_username, other_user_avatar: user.avatar, last_message_content: `Chat with ${escapeHTML(user.display_name)}`, unread_count: 0 }));
        renderChatListDOM(formattedUsers, true);
    } catch (error) { if (error.message !== "Banned user") { console.error('Error searching chat users:', error); chatListDiv.innerHTML = '<p style="text-align:center;padding:10px;opacity:0.7;color:red;">Error searching. Try again.</p>'; } }
}

function renderChatListDOM(usersToDisplay, isSearchResult = false) {
    const chatListDiv = document.getElementById('chatList'); if(!chatListDiv) return;
    const generalChatHTML = `
        <div class="chat-list-item global-chat-item" onclick="openGlobalChatWindow()">
            <img src="/static/images/bssmarket.png" alt="#General" class="chat-list-avatar">
            <div class="chat-list-info">
                <span class="chat-list-name">#General</span>
                <span class="chat-list-preview">Talk with everyone online!</span>
            </div>
        </div>`;
    chatListDiv.innerHTML = generalChatHTML;

    if (!usersToDisplay || usersToDisplay.length === 0) {
        if (!isSearchResult) {
            const noConvoMessage = document.createElement('p');
            noConvoMessage.style.textAlign = 'center';
            noConvoMessage.style.padding = '10px';
            noConvoMessage.style.opacity = '0.7';
            noConvoMessage.textContent = "No recent conversations. Search to start a new one!";
            chatListDiv.appendChild(noConvoMessage);
        }
        return;
    }
    if (!isSearchResult) usersToDisplay.sort((a, b) => new Date(b.last_message_at || 0) - new Date(a.last_message_at || 0));
    usersToDisplay.forEach(user => {
        const listItem = document.createElement('div'); listItem.className = 'chat-list-item'; listItem.dataset.userId = user.other_user_id; listItem.dataset.username = user.other_user_discord_name; listItem.dataset.avatar = user.other_user_avatar || '';
        const avatarUrl = user.other_user_avatar ? `https://cdn.discordapp.com/avatars/${user.other_user_id}/${user.other_user_avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png';
        let previewText = user.last_message_content || 'No messages yet'; if (!isSearchResult && user.last_message_sender_id === currentUser.discord_id && user.last_message_content) previewText = "You: " + user.last_message_content;
        listItem.innerHTML = `<img src="${escapeHTML(avatarUrl)}" alt="${escapeHTML(user.other_user_display_name)}" class="chat-list-avatar"><div class="chat-list-info"><span class="chat-list-name">${escapeHTML(user.other_user_display_name)}</span><span class="chat-list-preview">${escapeHTML(previewText)}</span></div>${user.unread_count > 0 ? `<span class="chat-list-unread">${user.unread_count}</span>` : ''}`;
        listItem.onclick = () => openChatWindow(user.other_user_id, user.other_user_discord_name, user.other_user_avatar); if(user.unread_count > 0) listItem.classList.add('has-unread'); chatListDiv.appendChild(listItem);
    });
}

function openGlobalChatWindow() {
    if (!currentUser) return;
    if (currentUser.banned) { showBanOverlay(currentUser.reason); return; }
    toggleChatPanel(false);

    if (openChatWindows[GLOBAL_CHAT_ID]) {
        const existingWindow = document.querySelector(`.chat-window[data-user-id="${GLOBAL_CHAT_ID}"]`);
        if (existingWindow) {
            existingWindow.classList.remove('minimized');
            const textarea = existingWindow.querySelector('textarea');
            if(textarea) textarea.focus();
        }
        return;
    }

    if (Object.keys(openChatWindows).length >= MAX_OPEN_CHAT_WINDOWS) {
        alert(`Max ${MAX_OPEN_CHAT_WINDOWS} chat windows open.`);
        const oldestWindowId = Object.keys(openChatWindows)[0];
        closeChatWindow(oldestWindowId, false);
    }

    const chatWindowsContainer = document.getElementById('chatWindowsContainer');
    if(!chatWindowsContainer) return;

    const windowDiv = document.createElement('div');
    windowDiv.className = 'chat-window';
    windowDiv.dataset.userId = GLOBAL_CHAT_ID;
    
    const avatarUrl = "/static/images/bssmarket.png";
    const chatName = "#General";

    windowDiv.innerHTML = `
        <div class="chat-window-header">
            <img src="${escapeHTML(avatarUrl)}" alt="${escapeHTML(chatName)}" class="chat-list-avatar" style="width:24px; height:24px; margin-right:8px;">
            <span class="chat-window-username">${escapeHTML(chatName)}</span>
            <div>
                <button class="chat-window-minimize-btn">_</button>
                <button class="chat-window-close-btn">×</button>
            </div>
        </div>
        <div class="chat-window-messages">
            <p class="chat-placeholder" style="text-align:center; padding:10px; opacity:0.7;">Loading messages...</p>
        </div>
        <div class="chat-window-input">
            <textarea placeholder="Type a message..." rows="1" maxlength="${GLOBAL_CHAT_MESSAGE_MAX_LENGTH_CLIENT_SIDE}"></textarea>
            <button class="chat-window-send-btn" title="Send"></button>
        </div>`;
    
    chatWindowsContainer.appendChild(windowDiv);
    openChatWindows[GLOBAL_CHAT_ID] = windowDiv;

    const closeBtn = windowDiv.querySelector('.chat-window-close-btn');
    if(closeBtn) closeBtn.onclick = () => closeChatWindow(GLOBAL_CHAT_ID);

    const minimizeBtn = windowDiv.querySelector('.chat-window-minimize-btn');
    if(minimizeBtn) minimizeBtn.onclick = () => minimizeChatWindow(GLOBAL_CHAT_ID);

    const header = windowDiv.querySelector('.chat-window-header');
    if(header) {
        header.ondblclick = () => minimizeChatWindow(GLOBAL_CHAT_ID);
        header.onclick = (e) => {
            if (e.target === header || (e.target && (e.target.classList.contains('chat-window-username') || e.target.classList.contains('chat-list-avatar')))) {
                if (windowDiv.classList.contains('minimized')) {
                    minimizeChatWindow(GLOBAL_CHAT_ID);
                }
            }
        };
    }
    
    const sendButton = windowDiv.querySelector('.chat-window-send-btn');
    const textarea = windowDiv.querySelector('textarea');

    if(sendButton) sendButton.onclick = () => sendMessageInGlobalWindow(textarea);
    if(textarea) {
        textarea.onkeydown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessageInGlobalWindow(textarea);
            }
        };
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        });
        textarea.focus();
    }

    if (socket && socket.connected) {
        socket.emit('request_global_chat_history');
    }
}

function sendMessageInGlobalWindow(textareaElement) {
    if (!socket || !socket.connected || !currentUser || isGlobalSendThrottled) return;
    if (currentUser.banned) { showBanOverlay(currentUser.reason); if(textareaElement) textareaElement.value = ''; return; }
    if(!textareaElement) return;

    const content = textareaElement.value.trim();
    if (!content) return;
    
    if (content.length > GLOBAL_CHAT_MESSAGE_MAX_LENGTH_CLIENT_SIDE) {
        alert(`Message exceeds max length of ${GLOBAL_CHAT_MESSAGE_MAX_LENGTH_CLIENT_SIDE} characters.`);
        return;
    }
    
    socket.emit('send_global_message', { content: content });
    
    textareaElement.value = '';
    textareaElement.style.height = 'auto';
    textareaElement.focus();

    isGlobalSendThrottled = true;
    const sendButton = textareaElement.nextElementSibling;
    if (sendButton) {
        sendButton.disabled = true;
        sendButton.style.cursor = 'not-allowed';
        sendButton.style.backgroundColor = '#95a5a6';
    }

    setTimeout(() => {
        isGlobalSendThrottled = false;
        if (sendButton) {
            sendButton.disabled = false;
            sendButton.style.cursor = 'pointer';
            sendButton.style.backgroundColor = '';
        }
    }, 5000);
}

function updateChatList(userId, discordUsername, avatar, lastMessage, isUnread) {
    const searchInput = document.getElementById('chatContactSearch'); const convoIndex = chatConversations.findIndex(c => c.other_user_id === userId); let userToUpdate;
    if (convoIndex > -1) userToUpdate = chatConversations[convoIndex]; else { userToUpdate = { other_user_id: userId, other_user_discord_name: discordUsername, other_user_display_name: discordUsername, other_user_avatar: avatar, unread_count: 0 }; chatConversations.unshift(userToUpdate); }
    userToUpdate.last_message_content = lastMessage; userToUpdate.last_message_at = new Date().toISOString(); if (isUnread) userToUpdate.unread_count = (userToUpdate.unread_count || 0) + 1;
    if (!searchInput || !searchInput.value.trim()) renderChatListDOM(chatConversations);
}

function initiateChatFromListing(sellerId, sellerDiscordUsername, sellerAvatar) {
    if (!currentUser) { alert("Please log in to chat with the seller."); return; } if (currentUser.banned) { showBanOverlay(currentUser.reason); return; }
    if (currentUser.discord_id === sellerId) { alert("You cannot chat with yourself."); return; }
    openChatWindow(sellerId, sellerDiscordUsername, sellerAvatar); toggleChatPanel(true);
}

function openChatWindow(userId, userDiscordName, avatarSlug) {
    if (!currentUser) return; if (currentUser.banned) { showBanOverlay(currentUser.reason); return; } if (currentUser.discord_id === userId) return;
    toggleChatPanel(false);
    if (openChatWindows[userId]) { const existingWindow = document.querySelector(`.chat-window[data-user-id="${userId}"]`); if (existingWindow) { existingWindow.classList.remove('minimized'); const textarea = existingWindow.querySelector('textarea'); if(textarea) textarea.focus(); if (socket && socket.connected) socket.emit('mark_as_read', { conversation_with_id: userId }); updateUnreadForConversation(userId, 0); } return; }
    if (Object.keys(openChatWindows).length >= MAX_OPEN_CHAT_WINDOWS) { alert(`Max ${MAX_OPEN_CHAT_WINDOWS} chat windows open.`); const oldestWindowId = Object.keys(openChatWindows)[0]; closeChatWindow(oldestWindowId, false); }
    const chatWindowsContainer = document.getElementById('chatWindowsContainer'); if(!chatWindowsContainer) return;
    const windowDiv = document.createElement('div'); windowDiv.className = 'chat-window'; windowDiv.dataset.userId = userId;
    const avatarUrl = avatarSlug ? `https://cdn.discordapp.com/avatars/${userId}/${avatarSlug}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png';
    windowDiv.innerHTML = `<div class="chat-window-header"><img src="${escapeHTML(avatarUrl)}" alt="${escapeHTML(userDiscordName)}" class="chat-list-avatar" style="width:24px; height:24px; margin-right:8px;"><span class="chat-window-username">${escapeHTML(userDiscordName)}</span><div><button class="chat-window-minimize-btn">_</button><button class="chat-window-close-btn">×</button></div></div><div class="chat-window-messages"><p class="chat-placeholder" style="text-align:center; padding:10px; opacity:0.7;">Loading messages...</p></div><div class="chat-window-input"><textarea placeholder="Type a message..." rows="1"></textarea><button class="chat-window-send-btn" title="Send"></button></div>`;
    chatWindowsContainer.appendChild(windowDiv); openChatWindows[userId] = windowDiv;
    const closeBtn = windowDiv.querySelector('.chat-window-close-btn'); if(closeBtn) closeBtn.onclick = () => closeChatWindow(userId);
    const minimizeBtn = windowDiv.querySelector('.chat-window-minimize-btn'); if(minimizeBtn) minimizeBtn.onclick = () => minimizeChatWindow(userId);
    const header = windowDiv.querySelector('.chat-window-header'); if(header) { header.ondblclick = () => minimizeChatWindow(userId); header.onclick = (e) => { if (e.target === header || (e.target && (e.target.classList.contains('chat-window-username') || e.target.classList.contains('chat-list-avatar')))) if (windowDiv.classList.contains('minimized')) minimizeChatWindow(userId); }; }
    const sendButton = windowDiv.querySelector('.chat-window-send-btn'), textarea = windowDiv.querySelector('textarea');
    if(sendButton) sendButton.onclick = () => sendMessageInWindow(userId, textarea);
    if(textarea) { textarea.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessageInWindow(userId, textarea); } }; textarea.addEventListener('input', () => { textarea.style.height = 'auto'; textarea.style.height = (textarea.scrollHeight) + 'px'; }); textarea.focus(); }
    if (socket && socket.connected) { socket.emit('request_chat_history', { other_user_id: userId }); socket.emit('mark_as_read', { conversation_with_id: userId }); }
    updateUnreadForConversation(userId, 0);
}

function closeChatWindow(userId, emitLeave = true) { const windowDiv = openChatWindows[userId]; if (windowDiv) { windowDiv.remove(); delete openChatWindows[userId]; } }
function minimizeChatWindow(userId) {
    const windowDiv = openChatWindows[userId];
    if (windowDiv) { windowDiv.classList.toggle('minimized'); if (!windowDiv.classList.contains('minimized')) { const textarea = windowDiv.querySelector('textarea'); if(textarea) textarea.focus(); if (socket && socket.connected) socket.emit('mark_as_read', { conversation_with_id: userId }); updateUnreadForConversation(userId, 0); } }
}
function sendMessageInWindow(recipientId, textareaElement) {
    if (!socket || !socket.connected || !currentUser) return; if (currentUser.banned) { showBanOverlay(currentUser.reason); if(textareaElement) textareaElement.value = ''; return; } if(!textareaElement) return;
    const content = textareaElement.value.trim(); if (!content) return;
    if (content.length > CHAT_MESSAGE_MAX_LENGTH_CLIENT_SIDE) { alert(`Message exceeds max length of ${CHAT_MESSAGE_MAX_LENGTH_CLIENT_SIDE} characters.`); return; }
    const timestamp = new Date().toISOString(); const messageDataForEmit = { recipient_id: recipientId, content: content };
    const messageDataForDisplay = { sender_id: currentUser.discord_id, sender_name: currentUser.username, sender_avatar: currentUser.avatar, recipient_id: recipientId, content: content, timestamp: timestamp };
    socket.emit('send_message', messageDataForEmit); appendMessageToWindow(recipientId, messageDataForDisplay, true);
    const convoIndex = chatConversations.findIndex(c => c.other_user_id === recipientId);
    if (convoIndex > -1) { chatConversations[convoIndex].last_message_content = "You: " + content; chatConversations[convoIndex].last_message_at = timestamp; chatConversations[convoIndex].last_message_sender_id = currentUser.discord_id; }
    else { let recipientDiscordName = 'User', recipientAvatar = null; const chatWindow = openChatWindows[recipientId]; if (chatWindow) { const usernameSpan = chatWindow.querySelector('.chat-window-username'); if (usernameSpan) recipientDiscordName = usernameSpan.textContent; const avatarImg = chatWindow.querySelector('.chat-list-avatar'); if(avatarImg) { const srcParts = avatarImg.src.split('/'); if (srcParts.length >= 2) recipientAvatar = srcParts[srcParts.length-1].split('.')[0]; } } chatConversations.unshift({ other_user_id: recipientId, other_user_discord_name: recipientDiscordName, other_user_display_name: recipientDiscordName, other_user_avatar: recipientAvatar, last_message_content: "You: " + content, last_message_at: timestamp, last_message_sender_id: currentUser.discord_id, unread_count: 0 }); }
    const searchInput = document.getElementById('chatContactSearch'); if (!searchInput || !searchInput.value.trim()) renderChatListDOM(chatConversations);
    textareaElement.value = ''; textareaElement.style.height = 'auto'; textareaElement.focus();
}

function appendMessageToWindow(chatPartnerId, messageData, isSelf) {
    const chatWindow = openChatWindows[chatPartnerId];
    if (chatWindow && chatWindow.classList.contains('minimized')) {
        if (!isSelf) {
            let currentUnread = parseInt(chatWindow.dataset.unreadCount || '0');
            chatWindow.dataset.unreadCount = currentUnread + 1;
        }
        return;
    }
    if (!chatWindow) return;

    const messagesDiv = chatWindow.querySelector('.chat-window-messages');
    if(!messagesDiv) return;

    const placeholder = messagesDiv.querySelector('p.chat-placeholder');
    if (placeholder) placeholder.remove();

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isSelf ? 'sent' : 'received');
    messageDiv.dataset.messageId = messageData.id;
    
    const contentToDisplay = messageData.content ? escapeHTML(messageData.content) : "";
    let timeString = 'Time N/A';
    if (messageData.timestamp) {
        try {
            timeString = new Date(messageData.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            console.warn("Could not format timestamp:", messageData.timestamp, e);
        }
    }

    let modActionsHtml = '';
    if (chatPartnerId === GLOBAL_CHAT_ID && currentUser && (currentUser.is_moderator || currentUser.is_admin) && !isSelf) {
        modActionsHtml = `<div class="global-chat-mod-actions" onclick="showGlobalChatModMenu(event, ${messageData.id})">⋮</div>`;
    }

    if (chatPartnerId === GLOBAL_CHAT_ID && !isSelf) {
        const senderNameDiv = document.createElement('div');
        senderNameDiv.className = 'message-sender-name';
        senderNameDiv.textContent = escapeHTML(messageData.sender_display_name || 'Unknown User');
        
        const avatarImg = document.createElement('img');
        avatarImg.className = 'message-sender-avatar';
        avatarImg.src = messageData.sender_avatar ? `https://cdn.discordapp.com/avatars/${messageData.sender_id}/${messageData.sender_avatar}.png` : 'https://cdn.discordapp.com/embed/avatars/0.png';
        avatarImg.alt = '';
        
        const senderInfoDiv = document.createElement('div');
        senderInfoDiv.className = 'message-sender-info';
        senderInfoDiv.appendChild(avatarImg);
        senderInfoDiv.appendChild(senderNameDiv);

        messageDiv.appendChild(senderInfoDiv);
    }
    
    messageDiv.innerHTML += `<p>${contentToDisplay}</p><span class="message-time">${timeString}</span>${modActionsHtml}`;

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    if (!isSelf && !document.hidden && chatWindow === document.activeElement?.closest('.chat-window')) {
        if (socket && socket.connected) {
            if (chatPartnerId !== GLOBAL_CHAT_ID) {
                socket.emit('mark_as_read', { conversation_with_id: chatPartnerId });
                updateUnreadForConversation(chatPartnerId, 0);
            }
        }
    } else if (!isSelf && chatPartnerId !== GLOBAL_CHAT_ID) {
        let currentUnread = parseInt(chatWindow.dataset.unreadCount || '0');
        chatWindow.dataset.unreadCount = currentUnread + 1;
    }
}

function showGlobalChatModMenu(event, messageId) {
    event.stopPropagation();
    closeGlobalChatModMenu(); // Close any existing menus

    const menu = document.createElement('div');
    menu.id = 'global-chat-mod-menu';
    menu.className = 'trade-item-context-menu'; // Reuse styles

    const options = [
        { label: 'Delete Message', action: () => {
            if (confirm('Are you sure you want to delete this message?')) {
                socket.emit('moderate_global_message', { message_id: messageId, action: 'delete' });
            }
            closeGlobalChatModMenu();
        }},
        { label: 'Delete & Ban User', action: () => {
            if (confirm('Are you sure you want to delete this message AND ban the user who sent it?')) {
                socket.emit('moderate_global_message', { message_id: messageId, action: 'delete_and_ban' });
            }
            closeGlobalChatModMenu();
        }}
    ];

    options.forEach(opt => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'trade-item-context-menu-option';
        optionDiv.textContent = opt.label;
        optionDiv.onclick = opt.action;
        menu.appendChild(optionDiv);
    });

    document.body.appendChild(menu);
    
    const clickX = event.clientX, clickY = event.clientY;
    const menuWidth = menu.offsetWidth, menuHeight = menu.offsetHeight;
    const windowWidth = window.innerWidth, windowHeight = window.innerHeight;

    let menuX = clickX - menuWidth; // Position to the left of the cursor
    let menuY = clickY;

    if (menuX < 0) menuX = clickX;
    if (clickY + menuHeight > windowHeight) menuY = clickY - menuHeight;
    
    menu.style.left = `${menuX}px`;
    menu.style.top = `${menuY}px`;
    menu.style.display = 'block';

    setTimeout(() => {
        document.addEventListener('click', closeGlobalChatModMenu, { once: true });
    }, 0);
}

function closeGlobalChatModMenu() {
    const existingMenu = document.getElementById('global-chat-mod-menu');
    if (existingMenu) existingMenu.remove();
}

function updateUnreadForConversation(userId, count) {
    const convoIndex = chatConversations.findIndex(c => c.other_user_id === userId); if (convoIndex > -1) chatConversations[convoIndex].unread_count = count;
    const searchInput = document.getElementById('chatContactSearch'); if (!searchInput || !searchInput.value.trim()) renderChatListDOM(chatConversations);
    const chatWindow = openChatWindows[userId]; if (chatWindow) chatWindow.dataset.unreadCount = count; let currentTotal = 0;
    chatConversations.forEach(convo => { currentTotal += (convo.unread_count || 0); });
    Object.values(openChatWindows).forEach(win => { if (win.classList.contains('minimized')) { const winUserId = win.dataset.userId; if (!chatConversations.find(c => c.other_user_id === winUserId && c.unread_count > 0)) { const winUnread = parseInt(win.dataset.unreadCount) || 0; if (winUnread > 0) currentTotal += winUnread; } } });
    updateTotalUnreadBadge(currentTotal, true);
}

function updateTotalUnreadBadge(change, absolute = false) {
    const launcher = document.getElementById('chatLauncher'); if(!launcher) return; const badge = launcher.querySelector('.chat-unread-badge'); if(!badge) return;
    if (absolute) totalUnreadMessages = change; else totalUnreadMessages += change;
    if (totalUnreadMessages < 0) totalUnreadMessages = 0;
    if (totalUnreadMessages > 0) { badge.textContent = totalUnreadMessages > 99 ? '99+' : totalUnreadMessages; badge.style.display = 'flex'; } else badge.style.display = 'none';
}

function parsePriceForSort(priceStr, isAuctionBid = false) { if (isAuctionBid) return parseFloat(priceStr) || 0; if (typeof priceStr === 'string' && (priceStr.toLowerCase() === 'negotiable' || priceStr.trim() === '')) return null; const price = parseFloat(priceStr); return isNaN(price) ? null : price; }
function handleListingSortChange() { const sortSelect = document.getElementById('sortListingsBy'); if (sortSelect) currentListingSortCriteria = sortSelect.value; renderFilteredAndSortedListings(); }
function handleAuctionSortChange() { const sortSelect = document.getElementById('sortAuctionsBy'); if (sortSelect) currentAuctionSortCriteria = sortSelect.value; renderFilteredAndSortedAuctions(); }

function renderFilteredAndSortedListings() {
    if (!currentListings) { displayListingsDOM([]); return; }
    const itemTextFilterInput = document.getElementById('filterItem'); const itemTextFilter = itemTextFilterInput ? itemTextFilterInput.value.toLowerCase().trim() : '';
    let listingsArray = Object.values(currentListings);
    if (itemTextFilter) listingsArray = listingsArray.filter(listing => (listing.items || '').toLowerCase().includes(itemTextFilter) || (listing.looking_for || '').toLowerCase().includes(itemTextFilter) || (listing.display_name || '').toLowerCase().includes(itemTextFilter) || (listing.discord_username || '').toLowerCase().includes(itemTextFilter));
    listingsArray.sort((a, b) => {
        switch (currentListingSortCriteria) {
            case 'oldest': return new Date(a.created_at) - new Date(b.created_at);
            case 'price_high_low': { const priceA = parsePriceForSort(a.price), priceB = parsePriceForSort(b.price); if (priceA === null && priceB === null) return 0; if (priceA === null) return 1; if (priceB === null) return -1; return priceB - priceA; }
            case 'price_low_high': { const priceA = parsePriceForSort(a.price), priceB = parsePriceForSort(b.price); if (priceA === null && priceB === null) return 0; if (priceA === null) return 1; if (priceB === null) return -1; return priceA - priceB; }
            case 'name_az': return (a.items || '').toLowerCase().localeCompare((b.items || '').toLowerCase());
            case 'name_za': return (b.items || '').toLowerCase().localeCompare((a.items || '').toLowerCase());
            case 'newest': default: return new Date(b.created_at) - new Date(a.created_at);
        }
    });
    displayListingsDOM(listingsArray);
}

function prepareTradeOfferSelectableItems() {
    tradeOfferAllStickerItems = [];
    tradeOfferStickerGroups = [];
    tradeOfferBeequipItems = [];
    tradeOfferIconItems = [];
    const beequipGroupsMap = new Map();
    const stickerGroupsMap = new Map();

    // Process Stickers and Sticker Groups
    for (const key in valueList) {
        const item = valueList[key];
        if (!item || typeof item !== 'object') continue;

        const groupName = STICKER_TO_GROUP_MAP[key];
        if (groupName) { // Only process items that are in our map
            if (!stickerGroupsMap.has(groupName)) {
                stickerGroupsMap.set(groupName, {
                    key: groupName,
                    name: groupName,
                    image: item.image || '/static/images/Hivesticker_sprout.png',
                    items: []
                });
            }
            // Add the robust renderType property here
            const stickerItem = { ...item, key: key, name: key, renderType: 'imageOnly', acronyms: item.acronyms || '' };
            stickerGroupsMap.get(groupName).items.push(stickerItem);
            tradeOfferAllStickerItems.push(stickerItem);
        }
    }

    // Process Star Signs separately
    if (STAR_SIGNS_DATA.length > 0) {
        // Add renderType to each sign
        const starSignItems = STAR_SIGNS_DATA.map(sign => ({ ...sign, key: sign.key, name: sign.name, renderType: 'imageOnly', acronyms: '' }));
        stickerGroupsMap.set("Star Signs", {
            key: "Star Signs",
            name: "Star Signs",
            image: starSignItems[0].image,
            items: starSignItems
        });
        starSignItems.forEach(sign => tradeOfferAllStickerItems.push(sign));
    }
    tradeOfferStickerGroups = Array.from(stickerGroupsMap.values());

    // Process Beequips
    for (const key in valueList) {
        const item = valueList[key];
        if (item && item.category === "Beequip Group") {
            if (!beequipGroupsMap.has(key)) beequipGroupsMap.set(key, { key: key, name: key, image: item.image || 'https://via.placeholder.com/50?text=?', category: "Beequip Group", isPseudoGroup: false, renderType: 'full', acronyms: item.acronyms || '' });
        } else if (item && item.category === "Beequip") {
            if (item.group_ref && valueList[item.group_ref] && valueList[item.group_ref].category === "Beequip Group") {
                if (!beequipGroupsMap.has(item.group_ref)) {
                    const groupData = valueList[item.group_ref];
                    beequipGroupsMap.set(item.group_ref, { key: item.group_ref, name: item.group_ref, image: groupData.image || getBeequipDisplayImage(groupData), category: "Beequip Group", isPseudoGroup: false, renderType: 'full', acronyms: groupData.acronyms || '' });
                }
            } else {
                const pseudoGroupKey = `_pseudo_${key}`;
                if (!beequipGroupsMap.has(pseudoGroupKey)) beequipGroupsMap.set(pseudoGroupKey, { key: pseudoGroupKey, name: key, image: getBeequipDisplayImage(item), category: "Beequip Group", isPseudoGroup: true, actualItemKey: key, renderType: 'full', acronyms: item.acronyms || '' });
            }
        }
    }
    tradeOfferBeequipItems = Array.from(beequipGroupsMap.values());

    // Process Icons
    iconFileNames.forEach(fileName => {
        const name = fileName.replace('.png', '').replace(/_/g, ' ');
        // Add the robust renderType property here
        tradeOfferIconItems.push({ key: name, name: name, value_min: 0, value_max: 0, graph_value: 0, image: `/static/images/${fileName}`, category: "Icon", renderType: 'imageOnly', acronyms: '' });
    });
    
    // Sort and create Fuse instances
    tradeOfferAllStickerItems.sort((a, b) => a.name.localeCompare(b.name));
    tradeOfferStickerGroups.sort((a, b) => a.name.localeCompare(b.name));
    tradeOfferBeequipItems.sort((a, b) => a.name.localeCompare(b.name));
    tradeOfferIconItems.sort((a, b) => a.name.localeCompare(b.name));

    const fuseOptions = { keys: ['name', 'category', 'acronyms'], threshold: 0.4, distance: 80, minMatchCharLength: 1 };
    tradeOfferFuseStickers = new Fuse(tradeOfferAllStickerItems, fuseOptions);
    tradeOfferFuseBeequips = new Fuse(tradeOfferBeequipItems, fuseOptions);
    tradeOfferFuseIcons = new Fuse(tradeOfferIconItems, fuseOptions);
}

function openTradeOfferItemSelection(target) {
    tradeOfferActiveTarget = target;
    const modal = document.getElementById('tradeOfferItemSelectionModal');
    const searchInput = document.getElementById('tradeOfferItemSearch');
    const quantityInput = document.getElementById('tradeOfferItemQuantity');
    if (!modal || !searchInput || !quantityInput) return;

    searchInput.value = '';
    quantityInput.value = '1';
    tradeOfferSelectedItem = null;
    tradeOfferSelectedBeequipGroupKey = null;
    tradeOfferSelectedStickerGroupKey = null;

    const categoryButtons = document.querySelectorAll('#tradeOfferItemCategorySelection .category-btn');
    let activeCategoryButton = document.querySelector('#tradeOfferItemCategorySelection .category-btn.active');
    if (!activeCategoryButton) {
        tradeOfferActiveCategory = 'sticker';
        const stickerButton = document.querySelector('#tradeOfferItemCategorySelection .category-btn[data-category="sticker"]');
        if (stickerButton) {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            stickerButton.classList.add('active');
        }
    } else {
        tradeOfferActiveCategory = activeCategoryButton.dataset.category;
    }

    filterTradeOfferItems();

    modal.style.display = 'block';
    searchInput.focus();
}

function closeTradeOfferItemSelection() { const modal = document.getElementById('tradeOfferItemSelectionModal'); if(modal) modal.style.display = 'none'; tradeOfferActiveTarget = null; tradeOfferSelectedItem = null; }

function populateTradeOfferItemSelectionList(itemsToDisplay, categoryType, options = {}) {
    const itemListDiv = document.getElementById('tradeOfferItemSelectionList');
    if (!itemListDiv) return;
    itemListDiv.innerHTML = '';
    itemListDiv.className = '';

    const ul = document.createElement('ul');

    if (categoryType === 'sticker-groups') {
        itemListDiv.classList.add('beequip-group-list');
        if (!itemsToDisplay || itemsToDisplay.length === 0) {
            itemListDiv.innerHTML = '<p class="loading-text">No Sticker categories found.</p>';
            return;
        }
        itemsToDisplay.forEach(group => {
            const li = document.createElement('li');
            li.dataset.groupKey = group.key;
            li.innerHTML = `<img src="${escapeHTML(group.image)}" alt="${escapeHTML(group.name)}" onerror="this.src='/static/images/Hivesticker_sprout.png';"><span class="item-name-popup">${escapeHTML(group.name)}</span>`;
            li.onclick = () => {
                tradeOfferSelectedStickerGroupKey = group.key;
                filterTradeOfferItems();
            };
            ul.appendChild(li);
        });
    } else if (categoryType === 'sticker-items') {
        itemListDiv.classList.add('beequip-group-list');

        if (options.showBackButton) {
            const backLi = document.createElement('li');
            backLi.innerHTML = `<img src="/static/images/Hivesticker_yellow_left_arrow.png" alt="Back" style="image-rendering: pixelated;"><span class="item-name-popup">Back to Categories</span>`;
            backLi.onclick = () => {
                tradeOfferSelectedStickerGroupKey = null;
                filterTradeOfferItems();
            };
            ul.appendChild(backLi);
        }

        if (!itemsToDisplay || itemsToDisplay.length === 0) {
            if (!options.showBackButton) {
                itemListDiv.innerHTML = '<p class="loading-text">No items found.</p>';
            }
        } else {
            itemsToDisplay.forEach(item => {
                const li = document.createElement('li');
                li.dataset.itemKey = item.key;
                const itemValueDisplay = formatValueDisplay(item.value_min, item.value_max, item.graph_value);
                li.innerHTML = `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" onerror="this.src='https://via.placeholder.com/35?text=?';"><span class="item-name-popup">${escapeHTML(item.name)}</span><span class="item-value-popup">${escapeHTML(itemValueDisplay)}</span>`;
                li.onclick = () => {
                    if (tradeOfferSelectedItem === item.key) {
                        tradeOfferSelectedItem = null;
                        li.classList.remove('selected');
                    } else {
                        tradeOfferSelectedItem = item.key;
                        ul.querySelectorAll('li.selected').forEach(el => el.classList.remove('selected'));
                        li.classList.add('selected');
                    }
                };
                ul.appendChild(li);
            });
        }
    } else if (categoryType === 'beequip') {
        itemListDiv.classList.add('beequip-group-list');
        if (!itemsToDisplay || itemsToDisplay.length === 0) {
            itemListDiv.innerHTML = '<p class="loading-text">No Beequip types found.</p>';
            return;
        }
        itemsToDisplay.forEach(group => {
            const li = document.createElement('li');
            li.dataset.groupKey = group.key;
            const groupImage = group.image || getBeequipDisplayImage(valueList[group.actualItemKey || group.key]) || '/static/images/beequip-box.webp';
            const groupDisplayName = group.name;
            li.innerHTML = `<img src="${escapeHTML(groupImage)}" alt="${escapeHTML(groupDisplayName)}" onerror="this.src='/static/images/beequip-box.webp';"><span class="item-name-popup">${escapeHTML(groupDisplayName)}</span>`;
            li.onclick = () => {
                const baseBeequipData = { key: group.actualItemKey || group.key, name: groupDisplayName, image: groupImage };
                openMyBeequipCustomizationModal(baseBeequipData);
            };
            ul.appendChild(li);
        });
    } else if (categoryType === 'icon') {
        itemListDiv.classList.add('icons-grid');
        itemsToDisplay.forEach(item => {
            const li = document.createElement('li');
            li.dataset.itemKey = item.key;
            li.innerHTML = `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.name)}" onerror="this.src='https://via.placeholder.com/40?text=?';"><span class="item-name-popup">${escapeHTML(item.name)}</span>`;
            li.onclick = () => {
                if (tradeOfferSelectedItem === item.key) {
                    tradeOfferSelectedItem = null;
                    li.classList.remove('selected');
                } else {
                    tradeOfferSelectedItem = item.key;
                    ul.querySelectorAll('li.selected').forEach(el => el.classList.remove('selected'));
                    li.classList.add('selected');
                }
            };
            ul.appendChild(li);
        });
    }

    itemListDiv.appendChild(ul);
}


function filterTradeOfferItems() {
    const searchInput = document.getElementById('tradeOfferItemSearch');
    if (!searchInput) return;
    const searchTerm = searchInput.value.toLowerCase().trim();

    if (tradeOfferActiveCategory === 'sticker') {
        if (searchTerm) {
            tradeOfferSelectedStickerGroupKey = null;
            const results = tradeOfferFuseStickers.search(searchTerm);
            const fullItemResults = results.map(r => tradeOfferAllStickerItems.find(item => item.key === r.item.key)).filter(Boolean);
            populateTradeOfferItemSelectionList(fullItemResults, 'sticker-items', { showBackButton: false });
        } else if (tradeOfferSelectedStickerGroupKey) {
            const group = tradeOfferStickerGroups.find(g => g.key === tradeOfferSelectedStickerGroupKey);
            populateTradeOfferItemSelectionList(group ? group.items : [], 'sticker-items', { showBackButton: true });
        } else {
            populateTradeOfferItemSelectionList(tradeOfferStickerGroups, 'sticker-groups');
        }
    } else {
        let sourceList, fuseInstance;
        switch (tradeOfferActiveCategory) {
            case 'beequip':
                sourceList = tradeOfferBeequipItems;
                fuseInstance = tradeOfferFuseBeequips;
                break;
            case 'icon':
                sourceList = tradeOfferIconItems;
                fuseInstance = tradeOfferFuseIcons;
                break;
            default:
                sourceList = [];
                fuseInstance = null;
        }
        if (searchTerm.length === 0) {
            populateTradeOfferItemSelectionList(sourceList, tradeOfferActiveCategory);
        } else if (fuseInstance) {
            const results = fuseInstance.search(searchTerm);
            populateTradeOfferItemSelectionList(results.map(r => r.item), tradeOfferActiveCategory);
        } else {
            populateTradeOfferItemSelectionList([], tradeOfferActiveCategory);
        }
    }
    tradeOfferSelectedItem = null;
    const itemListDiv = document.getElementById('tradeOfferItemSelectionList');
    if (itemListDiv) itemListDiv.querySelectorAll('li.selected').forEach(el => el.classList.remove('selected'));
}

function confirmTradeOfferItemSelection() {
    const quantityInput = document.getElementById('tradeOfferItemQuantity');
    if (!quantityInput) return;
    let quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 1) quantity = 1;
    if (quantity > 512) quantity = 512;
    let itemToAdd = null;

    if (tradeOfferSelectedItem && tradeOfferActiveTarget) {
        const itemKey = tradeOfferSelectedItem;
        let originalItemObject;
        switch (tradeOfferActiveCategory) {
            case 'sticker':
                originalItemObject = tradeOfferAllStickerItems.find(item => item.key === itemKey);
                break;
            case 'icon':
                originalItemObject = tradeOfferIconItems.find(item => item.key === itemKey);
                break;
            default:
                 originalItemObject = valueList[itemKey];
        }

        if (!originalItemObject) {
            alert('Error: Selected item data not found. Please try selecting again.');
            console.error("Could not find originalItemObject for key:", itemKey);
            closeTradeOfferItemSelection();
            return;
        }

        itemToAdd = {
            ...originalItemObject,
            key: itemKey,
            name: originalItemObject.name || itemKey,
            image: originalItemObject.image || getBeequipDisplayImage(originalItemObject),
            quantity: quantity,
            category: originalItemObject.category || "Unknown",
            customText: "",
            highlighted: false
        };

        if (tradeOfferActiveTarget === 'your') {
            addOrUpdateTradeItem(tradeOfferYourItems, itemToAdd);
        } else if (tradeOfferActiveTarget === 'their') {
            addOrUpdateTradeItem(tradeOfferTheirItems, itemToAdd);
        }
    } else if (!tradeOfferSelectedItem && tradeOfferActiveTarget && tradeOfferActiveCategory === 'beequip') {
        alert("Please select a Beequip type to customize.");
        return;
    } else {
        alert('Please select an item.');
        return;
    }

    renderTradeOfferItems();
    updateTradeOfferResults();
    closeTradeOfferItemSelection();
}


function addOrUpdateTradeItem(itemList, newItem) {
    const existingItemIndex = itemList.findIndex(item => item.key === newItem.key);
    if (existingItemIndex > -1) { itemList[existingItemIndex].quantity += newItem.quantity; if (itemList[existingItemIndex].quantity > 512) itemList[existingItemIndex].quantity = 512; }
    else { newItem.highlighted = false; itemList.push(newItem); }
}

function renderTradeOfferItems() {
    renderItemsInContainer(tradeOfferYourItems, 'offer-your', 'your');
    renderItemsInContainer(tradeOfferTheirItems, 'offer-their', 'their');
}

function renderItemsInContainer(items, containerId, offerSide) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const addButton = container.querySelector('.trade-add-item-button');
    container.querySelectorAll('.item-wrapper').forEach(wrapper => wrapper.remove());

    const imageLoadPromises = [];

    items.forEach((item, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'item-wrapper';

        const isImageOnly = item.renderType === 'imageOnly';

        if (isImageOnly) {
            wrapper.classList.add('sticker-trade-item'); // Simplified class for both stickers and icons
        } else {
            wrapper.classList.add('beequip-trade-item');
        }

        if (item.highlighted) wrapper.classList.add('highlighted-trade-item');
        if (item.customizationData) wrapper.classList.add('customized-beequip');

        const img = document.createElement('img');
        img.src = escapeHTML(item.image);
        img.alt = escapeHTML(item.name);
        img.onerror = () => { img.src = 'https://via.placeholder.com/48?text=?'; };
        
        if (isImageOnly) {
            img.style.padding = "0";
            img.style.backgroundColor = "transparent";
            img.style.boxShadow = "none";
            img.style.filter = "drop-shadow(0 2px 4px rgba(0,0,0,0.1))";
        }
        
        if (img.src) {
            imageLoadPromises.push(img.decode().catch(() => {
                console.warn(`Could not decode image for: ${item.name}`);
            }));
        }

        img.addEventListener('click', (event) => {
            event.preventDefault(); event.stopPropagation();
            showTradeItemContextMenu(event, offerSide, item.key, index);
        });
        wrapper.appendChild(img);

        const textContentDiv = document.createElement('div');
        textContentDiv.className = 'trade-item-content';
            
        // Beequip-specific rendering (name, stats)
        if (!isImageOnly) {
            const nameLabel = document.createElement('span');
            nameLabel.className = 'trade-item-name';
            nameLabel.textContent = escapeHTML(item.name);
            nameLabel.title = escapeHTML(item.name);
            textContentDiv.appendChild(nameLabel);

            if (item.customizationData) {
                const cust = item.customizationData;
                const metaDiv = document.createElement('div');
                metaDiv.className = 'beequip-display-meta';

                if (cust.stars > 0) {
                    const starsDiv = document.createElement('div');
                    starsDiv.className = 'beequip-display-stars';
                    let starsHTML = '';
                    for (let i = 1; i <= 5; i++) {
                        if (i <= cust.stars) starsHTML += '<span>★</span>';
                        else if (i - 0.5 === cust.stars) starsHTML += '<span class="half-star-display"></span>';
                        else starsHTML += '<span class="empty">☆</span>';
                    }
                    starsDiv.innerHTML = starsHTML;
                    metaDiv.appendChild(starsDiv);
                }
                if (cust.waxes && cust.waxes.length > 0) {
                    const waxesDiv = document.createElement('div');
                    waxesDiv.className = 'beequip-display-waxes';
                    cust.waxes.forEach(wax => {
                        const waxImgEl = document.createElement('img');
                        waxImgEl.src = escapeHTML(wax.src);
                        waxImgEl.alt = escapeHTML(wax.alt);
                        waxImgEl.onerror = function() {
                            this.style.display='none';
                            const placeholder = document.createElement('div');
                            placeholder.className = 'beequip-display-wax-placeholder';
                            placeholder.textContent = escapeHTML((wax.alt && wax.alt.length > 0) ? wax.alt.substring(0,3) : (wax.type && wax.type.length > 0 ? wax.type.substring(0,3) : 'Wax'));
                            this.parentElement.insertBefore(placeholder, this);
                         };
                        waxesDiv.appendChild(waxImgEl);
                    });
                    metaDiv.appendChild(waxesDiv);
                }
                
                if (metaDiv.hasChildNodes()) {
                    textContentDiv.appendChild(metaDiv);
                }

                if (cust.stats && (cust.stats.buffs.length > 0 || cust.stats.debuffs.length > 0 || cust.stats.bonuses.length > 0 || cust.stats.abilities.length > 0)) {
                    const statsList = document.createElement('ul');
                    statsList.className = 'beequip-display-stats-list';
                    const addStatsToList = (statsArray, className) => {
                        if (statsArray && statsArray.length > 0) {
                            statsArray.forEach(statText => {
                                if (statText && statText.trim()) {
                                    const li = document.createElement('li');
                                    li.className = className;
                                    li.textContent = escapeHTML(statText);
                                    statsList.appendChild(li);
                                }
                            });
                        }
                    };
                    addStatsToList(cust.stats.buffs, 'buff');
                    addStatsToList(cust.stats.debuffs, 'debuff');
                    addStatsToList(cust.stats.bonuses, 'bonus');
                    addStatsToList(cust.stats.abilities, 'ability');
                    if (statsList.hasChildNodes()) textContentDiv.appendChild(statsList);
                }
            }
        }
        
        // --- FIX START ---
        // This block now runs for ALL item types (beequips, stickers, icons)
        // and is no longer inside an 'else if' for beequips.
        if (item.customText && item.customText.trim() !== '') {
            const customTextLabel = document.createElement('div');
            customTextLabel.className = 'trade-item-custom-text';
            
            // Add "Note: " prefix in bold
            const notePrefix = document.createElement('strong');
            notePrefix.textContent = 'Note: ';
            const noteText = document.createTextNode(escapeHTML(item.customText));
            
            customTextLabel.appendChild(notePrefix);
            customTextLabel.appendChild(noteText);

            customTextLabel.title = escapeHTML(item.customText);
            textContentDiv.appendChild(customTextLabel);
        }
        // --- FIX END ---
        
        // Only append the text content div if it actually has content
        if (textContentDiv.hasChildNodes()) {
            wrapper.appendChild(textContentDiv);
        }
        
        const quantityLabel = document.createElement('span');
        quantityLabel.className = 'trade-item-quantity';
        quantityLabel.textContent = `${item.quantity}x`;

        const dotsMenuIcon = document.createElement('div');
        dotsMenuIcon.className = 'trade-item-dots-menu';
        dotsMenuIcon.innerHTML = '⋮';
        dotsMenuIcon.title = "More options";
        dotsMenuIcon.addEventListener('click', (event) => {
            event.preventDefault(); event.stopPropagation();
            showTradeItemContextMenu(event, offerSide, item.key, index);
        });
        
        wrapper.appendChild(quantityLabel);
        wrapper.appendChild(dotsMenuIcon);

        if (addButton) {
            container.insertBefore(wrapper, addButton);
        } else {
            container.appendChild(wrapper);
        }
    });

    Promise.all(imageLoadPromises).then(() => {
        applyMasonryLayout(container);
    });
}

function showTradeItemContextMenu(event, offerSide, itemKey, itemIndex) {
    closeTradeItemContextMenu();
    const menu = document.createElement('div'); menu.id = 'trade-item-context-menu'; menu.className = 'trade-item-context-menu';
    const itemsListRef = offerSide === 'your' ? tradeOfferYourItems : tradeOfferTheirItems; const currentItem = itemsListRef[itemIndex];
    const isBeequip = currentItem && currentItem.category && currentItem.category.toLowerCase().includes('beequip');
    const options = [
        { label: 'Delete', action: () => { removeItemFromTrade(offerSide, itemKey); closeTradeItemContextMenu(); } },
        { label: currentItem && currentItem.highlighted ? 'Remove Highlight' : 'Highlight', action: () => { if (currentItem) { currentItem.highlighted = !currentItem.highlighted; renderTradeOfferItems(); updateTradeOfferResults(); } closeTradeItemContextMenu(); } }
    ];
    if (isBeequip) options.push({ label: currentItem && currentItem.customText ? 'Edit Stats Note' : 'Add Stats Note', action: () => { if (currentItem) { const currentText = currentItem.customText || ''; const newText = prompt(`Enter stats note for ${escapeHTML(currentItem.name)} (max 50 chars):`, currentText); if (newText !== null) { currentItem.customText = newText.substring(0, 50); renderTradeOfferItems(); updateTradeOfferResults(); } } closeTradeItemContextMenu(); } });
    else options.push({ label: currentItem && currentItem.customText ? 'Edit Note' : 'Add Note', action: () => { if (currentItem) { const currentText = currentItem.customText || ''; const newText = prompt(`Enter note for ${escapeHTML(currentItem.name)} (max 50 chars):`, currentText); if (newText !== null) { currentItem.customText = newText.substring(0, 50); renderTradeOfferItems(); updateTradeOfferResults(); } } closeTradeItemContextMenu(); } });
    options.push({ label: 'Change Quantity', action: () => { if (currentItem) { const currentQuantity = currentItem.quantity; const newQuantityStr = prompt(`Enter new quantity for ${escapeHTML(currentItem.name)} (0 to remove, 1-512):`, currentQuantity); if (newQuantityStr !== null) { let newQuantity = parseInt(newQuantityStr); if (isNaN(newQuantity)) newQuantity = currentQuantity; if (newQuantity <= 0) removeItemFromTrade(offerSide, itemKey); else currentItem.quantity = Math.min(Math.max(1, newQuantity), 512); renderTradeOfferItems(); updateTradeOfferResults(); } } closeTradeItemContextMenu(); } });
    options.forEach(opt => { const optionDiv = document.createElement('div'); optionDiv.className = 'trade-item-context-menu-option'; optionDiv.textContent = opt.label; optionDiv.onclick = opt.action; menu.appendChild(optionDiv); });
    document.body.appendChild(menu); const clickX = event.clientX, clickY = event.clientY, menuWidth = menu.offsetWidth, menuHeight = menu.offsetHeight, windowWidth = window.innerWidth, windowHeight = window.innerHeight;
    let menuX = clickX + 5, menuY = clickY + 5;
    if (clickX + menuWidth + 5 > windowWidth) menuX = clickX - menuWidth - 5; if (clickY + menuHeight + 5 > windowHeight) menuY = clickY - menuHeight - 5;
    menu.style.left = `${Math.max(0, menuX)}px`; menu.style.top = `${Math.max(0, menuY)}px`; menu.style.display = 'block';
    setTimeout(() => { document.addEventListener('click', handleClickOutsideContextMenu, { once: true }); }, 0);
}

function closeTradeItemContextMenu() { const existingMenu = document.getElementById('trade-item-context-menu'); if (existingMenu) existingMenu.remove(); document.removeEventListener('click', handleClickOutsideContextMenu); }
function handleClickOutsideContextMenu(event) { const menu = document.getElementById('trade-item-context-menu'); if (menu && !menu.contains(event.target) && !(event.target.tagName === 'IMG' && event.target.closest('.item-wrapper'))) closeTradeItemContextMenu(); else if (menu && !menu.contains(event.target) && (event.target.tagName === 'IMG' && event.target.closest('.item-wrapper'))) document.removeEventListener('click', handleClickOutsideContextMenu); else if (menu && menu.contains(event.target)) document.addEventListener('click', handleClickOutsideContextMenu, { once: true }); }
function removeItemFromTrade(offerSide, itemKey) { if (offerSide === 'your') tradeOfferYourItems = tradeOfferYourItems.filter(item => item.key !== itemKey); else if (offerSide === 'their') tradeOfferTheirItems = tradeOfferTheirItems.filter(item => item.key !== itemKey); renderTradeOfferItems(); updateTradeOfferResults(); }

function calculateTradeInfo(items) {
    let total = 0;
    let hasCustomValue = false;
    
    items.forEach(item => {
        if (item.hasCustomValue) {
            hasCustomValue = true;
        }

        const valMin = parseValueFromString(item.value_min);
        const valMax = parseValueFromString(item.value_max);
        
        let itemValue = 0;
        if (valMin !== null && valMax !== null) {
            itemValue = (valMin + valMax) / 2;
        } else if (valMin !== null) {
            itemValue = valMin;
        } else if (valMax !== null) {
            itemValue = valMax;
        }
        
        if (itemValue === 0 && item.graph_value) {
            itemValue = item.graph_value;
        }

        total += itemValue * item.quantity;
    });

    return { total, hasCustomValue };
}

function updateTradeOfferResults() {
    const yourInfo = calculateTradeInfo(tradeOfferYourItems);
    const theirInfo = calculateTradeInfo(tradeOfferTheirItems);

    const yourTotal = yourInfo.total;
    const theirTotal = theirInfo.total;

    const yourTotalEl = document.getElementById('result-yourtotal');
    const theirTotalEl = document.getElementById('result-theirtotal');
    const diffEl = document.getElementById('result-difference');
    const wlEl = document.getElementById('result-wl');
    
    const yourIndicator = document.querySelector('#main-offer-your .custom-value-indicator');
    const theirIndicator = document.querySelector('#main-offer-their .custom-value-indicator');
    if (yourIndicator) yourIndicator.style.display = yourInfo.hasCustomValue ? 'inline' : 'none';
    if (theirIndicator) theirIndicator.style.display = theirInfo.hasCustomValue ? 'inline' : 'none';
    
    if(yourTotalEl) renderSecureValue(yourTotalEl, yourTotal); 
    if(theirTotalEl) renderSecureValue(theirTotalEl, theirTotal);
    
    const diff = theirTotal - yourTotal;
    const percentage = (yourTotal > 0 && theirTotal > 0) ? Math.floor((yourTotal / theirTotal) * 100) : (yourTotal === 0 && theirTotal > 0 ? 0 : (yourTotal > 0 && theirTotal === 0 ? Infinity : 100));
    
    if(diffEl) diffEl.textContent = `${diff.toFixed(2)} Signs (${percentage === Infinity ? '∞' : percentage}%)`;
    
    let wlStatus = 'Fair'; 
    const margin = 0.075;
    if (theirTotal > yourTotal * (1 + margin)) {
        wlStatus = 'Win';
    } else if (yourTotal > theirTotal * (1 + margin)) {
        wlStatus = 'Lose';
    }
    
    if(wlEl) { 
        wlEl.textContent = wlStatus; 
        wlEl.className = 'trade-result-status'; 
        if (wlStatus.includes('Win')) {
            wlEl.classList.add('win'); 
        } else if (wlStatus.includes('Lose')) {
            wlEl.classList.add('lose'); 
        } else if (wlStatus === 'Fair') {
            wlEl.classList.add('fair'); 
        }
    }
}

function renderFilteredAndSortedAuctions() {
    if (!currentAuctions) { displayAuctions([]); return; }
    const auctionSearchInput = document.getElementById('auctionSearch'), itemTextFilter = auctionSearchInput ? auctionSearchInput.value.toLowerCase().trim() : '';
    let auctionsArray = Object.values(currentAuctions);
    if (itemTextFilter) auctionsArray = auctionsArray.filter(auction => (auction.items || '').toLowerCase().includes(itemTextFilter) || (auction.looking_for || '').toLowerCase().includes(itemTextFilter) || (auction.display_name || '').toLowerCase().includes(itemTextFilter) || (auction.discord_username || '').toLowerCase().includes(itemTextFilter));
    auctionsArray.sort((a, b) => {
        switch (currentAuctionSortCriteria) {
            case 'oldest': return new Date(a.created_at) - new Date(b.created_at);
            case 'newest': return new Date(b.created_at) - new Date(a.created_at);
            case 'bid_high_low': { const bidA = parsePriceForSort(a.current_bid, true), bidB = parsePriceForSort(b.current_bid, true); return bidB - bidA; }
            case 'bid_low_high': { const bidA = parsePriceForSort(a.current_bid, true), bidB = parsePriceForSort(b.current_bid, true); return bidA - bidB; }
            case 'name_az': return (a.items || '').toLowerCase().localeCompare((b.items || '').toLowerCase());
            case 'name_za': return (b.items || '').toLowerCase().localeCompare((a.items || '').toLowerCase());
            case 'ends_soon': default: return new Date(a.auction_end) - new Date(b.auction_end);
        }
    });
    displayAuctions(auctionsArray);
}

function displayAuctions(auctionsArray) {
    const container = document.getElementById('auctionsContainer'); if (!container) return;
    if (!auctionsArray || auctionsArray.length === 0) { container.innerHTML = `<div class="empty-state"><img src="/static/images/peppermint_cub_placeholder.png" alt="Auction"><p>No active auctions.</p></div>`; return; }
    let html = '<div class="auctions-grid">';
    auctionsArray.forEach(auction => {
        const endTime = new Date(auction.auction_end), now = new Date(), timeLeft = endTime.getTime() - now.getTime(), hours = Math.floor(timeLeft / (1000 * 60 * 60));
        let timeLeftClass = (timeLeft <= 0) ? 'ended' : (hours < 1) ? 'ending-soon' : (hours < 6) ? 'ending-today' : '';
        const sellerDisplayName = auction.display_name || auction.discord_username || "Unknown Seller", currentBidderDisplayName = auction.current_bidder_display_name || "No bids yet";
        html += `<div class="auction-card ${timeLeftClass}" data-id="${auction.id}"><div class="auction-header"><h3>${escapeHTML(auction.items)}</h3><span class="time-left">${formatTimeRemaining(auction.auction_end)}</span></div><div class="auction-body"><p><strong>Current Bid:</strong> ${escapeHTML(String(auction.current_bid))} Signs</p><p><strong>Bidder:</strong> ${escapeHTML(currentBidderDisplayName)}</p><p><strong>Seller:</strong> ${escapeHTML(sellerDisplayName)}</p></div><div class="auction-footer">${timeLeft > 0 ? `<button onclick="openBidModal('${auction.id}')" class="bid-button">Place Bid</button>` : '<span class="auction-ended-label">Auction Ended</span>'}<button onclick="viewListingDetails('${auction.id}')" class="details-button">View Details</button></div></div>`;
    });
    html += '</div>'; container.innerHTML = html;
}

function clearMyBeequipCustomizationForm() {
    const statsSection = document.getElementById('stats-section-modal'); if (statsSection) statsSection.innerHTML = '';
    selectedStarsForModal = 0; generateStarsForModal(0); formSelectedWaxesForModal = []; initializeWaxSlotsInModal();
    const minValInput = document.getElementById('customBeequipValueMin'), maxValInput = document.getElementById('customBeequipValueMax');
    if(minValInput) minValInput.value = "0"; if(maxValInput) maxValInput.value = "0";
}

function populateStatsInputsForModal(beequipBaseNameFromModalTitle) {
    const statsSection = document.getElementById('stats-section-modal'); if (!statsSection) return; statsSection.innerHTML = '';
    const baseData = baseBeequipDataFromScraped[beequipBaseNameFromModalTitle];
    if (!baseData) { statsSection.innerHTML = `<div class="stat-wrapper-modal"><label class="beequip-buff-label">Buff 1: <input type="text" class="stat-input-modal" data-stat-type="buff" placeholder="e.g., +5% Energy"></label></div><div class="stat-wrapper-modal"><label class="beequip-debuff-label">Debuff 1: <input type="text" class="stat-input-modal" data-stat-type="debuff" placeholder="e.g., -2% Movespeed"></label></div><div class="stat-wrapper-modal"><label class="beequip-bonus-label">Bonus 1: <input type="text" class="stat-input-modal" data-stat-type="bonus" placeholder="e.g., x1.1 Pollen"></label></div><div class="stat-wrapper-modal"><label class="beequip-ability-label">Ability: <input type="text" class="stat-input-modal" data-stat-type="ability" placeholder="e.g., Haste Lvl 5"></label></div>`; return; }
    const createStatEntry = (statText, type, isAbility = false) => {
        const wrapper = document.createElement('div'); wrapper.className = 'stat-wrapper-modal'; const label = document.createElement('label'); label.className = `beequip-${type}-label`;
        if (isAbility) { const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.dataset.statText = statText; checkbox.dataset.statType = 'ability'; label.appendChild(document.createTextNode(statText + " ")); label.appendChild(checkbox); }
        else { label.textContent = statText + " "; const input = document.createElement('input'); input.type = 'number'; input.step = 'any'; input.placeholder = "Value"; input.className = 'stat-input-modal'; input.dataset.statText = statText; input.dataset.statType = type; label.appendChild(input); }
        wrapper.appendChild(label); return wrapper;
    };
    if (baseData.buffs && baseData.buffs.length > 0) baseData.buffs.forEach(stat => statsSection.appendChild(createStatEntry(stat, 'buff')));
    if (baseData.debuffs && baseData.debuffs.length > 0) baseData.debuffs.forEach(stat => statsSection.appendChild(createStatEntry(stat, 'debuff')));
    if (baseData.bonuses && baseData.bonuses.length > 0) baseData.bonuses.forEach(stat => statsSection.appendChild(createStatEntry(stat, 'bonus')));
    if (baseData.abilities && baseData.abilities.length > 0) baseData.abilities.forEach(stat => statsSection.appendChild(createStatEntry(stat, 'ability', true)));
}

function generateStarsForModal(starCount = 0) {
    const starSection = document.getElementById('stars-rating-modal'); if (!starSection) return; starSection.innerHTML = '';
    for (let i = 1; i <= 5; i++) {
        const starContainer = document.createElement('div'); starContainer.className = 'star-container-modal'; starContainer.dataset.value = i;
        const fullStar = document.createElement('span'); fullStar.className = 'star-full'; fullStar.textContent = '★';
        const halfStar = document.createElement('span'); halfStar.className = 'star-half'; halfStar.innerHTML = '';
        if (i <= starCount) { fullStar.classList.add('filled'); halfStar.style.display = 'none'; }
        else if (i - 0.5 === starCount) { fullStar.style.display = 'none'; halfStar.classList.add('filled'); }
        else { fullStar.style.display = 'block'; halfStar.style.display = 'none'; }
        starContainer.appendChild(fullStar); starContainer.appendChild(halfStar); starSection.appendChild(starContainer);
        starContainer.addEventListener('click', function(event) { const starValue = parseFloat(this.dataset.value), rect = this.getBoundingClientRect(), clickX = event.clientX - rect.left; if (clickX <= rect.width / 2) setStarsForModal(starValue - 0.5); else setStarsForModal(starValue); });
    }
}

function setStarsForModal(starValue) { if (selectedStarsForModal === starValue) { if (starValue % 1 !== 0) selectedStarsForModal = 0; else selectedStarsForModal = starValue - 0.5; } else selectedStarsForModal = starValue; if (selectedStarsForModal < 0) selectedStarsForModal = 0; generateStarsForModal(selectedStarsForModal); }
function initializeWaxSlotsInModal() { formSelectedWaxesForModal = []; renderSelectedWaxesInModal(); }

function renderSelectedWaxesInModal() {
    const waxSlotsContainer = document.getElementById('wax-slots-modal'), waxCountDisplay = document.getElementById('wax-count-modal'); if (!waxSlotsContainer || !waxCountDisplay) return;
    waxSlotsContainer.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const slotImg = document.createElement('img'); slotImg.classList.add('wax-slot-modal');
        if (i < formSelectedWaxesForModal.length) { slotImg.src = escapeHTML(formSelectedWaxesForModal[i].src); slotImg.alt = escapeHTML(formSelectedWaxesForModal[i].alt); slotImg.dataset.waxType = formSelectedWaxesForModal[i].type; slotImg.onerror = function() { this.style.display='none'; const placeholder = document.createElement('div'); placeholder.className = 'wax-placeholder-modal'; placeholder.textContent = escapeHTML(formSelectedWaxesForModal[i].alt ? formSelectedWaxesForModal[i].alt.substring(0,3) : (formSelectedWaxesForModal[i].type ? formSelectedWaxesForModal[i].type.substring(0,3) : 'Wax')); this.parentElement.insertBefore(placeholder, this); }; }
        else { slotImg.src = '/static/images/EmptyWax.webp'; slotImg.alt = 'Empty Slot'; slotImg.onerror = function() { this.style.display='none'; const placeholder = document.createElement('div'); placeholder.className = 'wax-placeholder-modal'; placeholder.textContent = 'Empty'; this.parentElement.insertBefore(placeholder, this); }; }
        slotImg.addEventListener('click', function() { if (i < formSelectedWaxesForModal.length) { formSelectedWaxesForModal.splice(i, 1); renderSelectedWaxesInModal(); } });
        waxSlotsContainer.appendChild(slotImg);
    }
    waxCountDisplay.textContent = formSelectedWaxesForModal.length;
}

function openMyBeequipCustomizationModal(beequipBaseData) {
    if (!beequipCustomizationModal) { console.error("Beequip customization modal not initialized."); return; }
    currentBeequipDataForModal = beequipBaseData; const titleElement = document.getElementById('beequip-name-modal-title');
    if (titleElement) titleElement.textContent = escapeHTML(beequipBaseData.name);
    clearMyBeequipCustomizationForm(); populateStatsInputsForModal(beequipBaseData.name);
    beequipCustomizationModal.style.display = 'block'; const tradeOfferSelectionModal = document.getElementById('tradeOfferItemSelectionModal');
    if (tradeOfferSelectionModal) tradeOfferSelectionModal.style.display = 'none';
}

function closeMyBeequipCustomizationModal() { if (beequipCustomizationModal) beequipCustomizationModal.style.display = 'none'; currentBeequipDataForModal = null; }

function confirmMyBeequipCustomization() {
    if (!currentBeequipDataForModal) { alert("Error: No beequip selected for customization."); console.error("confirmMyBeequipCustomization: currentBeequipDataForModal is null"); return; }
    const quantityInput = document.getElementById('tradeOfferItemQuantity'), quantity = quantityInput ? (parseInt(quantityInput.value) || 1) : 1;
    const collectedStats = { buffs: [], debuffs: [], bonuses: [], abilities: [] };
    document.querySelectorAll('#stats-section-modal .stat-wrapper-modal').forEach(wrapper => {
        const labelElement = wrapper.querySelector('label'), inputElement = labelElement ? labelElement.querySelector('input[type="number"], input[type="checkbox"]') : null;
        if (!inputElement || !labelElement) return;
        const singularStatType = inputElement.dataset.statType; let targetStatsArrayKey = singularStatType === 'ability' ? 'abilities' : (singularStatType === 'bonus' ? 'bonuses' : singularStatType + "s");
        const originalStatText = inputElement.dataset.statText;
        if (inputElement.type === 'checkbox') { if (inputElement.checked && typeof originalStatText === 'string' && originalStatText.trim() !== "" && collectedStats.hasOwnProperty(targetStatsArrayKey)) collectedStats[targetStatsArrayKey].push(originalStatText); }
        else if (inputElement.type === 'number') { const value = inputElement.value.trim(); if (value !== "" && typeof originalStatText === 'string' && originalStatText.trim() !== "" && collectedStats.hasOwnProperty(targetStatsArrayKey)) { let displayStatTextPart = originalStatText, operator = ""; const operatorMatch = originalStatText.match(/^([+\-xX])\s*(.*)/); if (operatorMatch) { operator = operatorMatch[1]; displayStatTextPart = operatorMatch[2].trim(); } const space = (displayStatTextPart.length > 0 && !displayStatTextPart.startsWith('%')) ? " " : ""; const finalStatString = `${operator}${value}${space}${displayStatTextPart}`; collectedStats[targetStatsArrayKey].push(finalStatString); } }
    });
    const customValueMinInput = document.getElementById('customBeequipValueMin'), customValueMaxInput = document.getElementById('customBeequipValueMax');
    let customValueMin = customValueMinInput ? parseFloat(customValueMinInput.value) : 0, customValueMax = customValueMaxInput ? parseFloat(customValueMaxInput.value) : 0;
    if (isNaN(customValueMin) || customValueMin < 0) customValueMin = 0; if (isNaN(customValueMax) || customValueMax < 0) customValueMax = 0; if (customValueMin > customValueMax) customValueMax = customValueMin;
    
    const hasCustomValue = (customValueMin > 0 || customValueMax > 0);

    const itemToAdd = { 
        key: `_customized_${currentBeequipDataForModal.key.replace(/[\s()]+/g, '_')}_${Date.now()}`, 
        name: currentBeequipDataForModal.name, 
        image: currentBeequipDataForModal.image, 
        quantity: quantity, 
        category: "Beequip (Customized)", 
        value_min: customValueMin, 
        value_max: customValueMax, 
        graph_value: calculateGraphValue(customValueMin, customValueMax), 
        customizationData: { stars: selectedStarsForModal, waxes: [...formSelectedWaxesForModal], stats: collectedStats }, 
        hasCustomValue: hasCustomValue, 
        customText: "", 
        highlighted: false,
        renderType: 'full' // Explicitly set the render type
    };
    
    if (tradeOfferActiveTarget === 'your') addOrUpdateTradeItem(tradeOfferYourItems, itemToAdd); else if (tradeOfferActiveTarget === 'their') addOrUpdateTradeItem(tradeOfferTheirItems, itemToAdd);
    renderTradeOfferItems(); updateTradeOfferResults(); closeMyBeequipCustomizationModal();
}

const lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.getAttribute('data-src');
            if (!src) return;

            img.src = src;
            img.classList.add('loaded'); // For fade-in effect
            observer.unobserve(img); // Stop observing once loaded
        }
    });
}, {
    rootMargin: '0px 0px 200px 0px' // Load images 200px before they enter the viewport
});

function observeLazyImage(imageElement) {
    lazyImageObserver.observe(imageElement);
}

function generateStickerListForSubtab(subTabName) {
    const subTabElement = document.getElementById(subTabName);
    if (!subTabElement) {
        console.error(`Subtab element #${subTabName} not found for generation.`);
        return;
    }

    const valueListContainer = subTabElement.querySelector('.value-list');
    if (!valueListContainer) {
        console.error(`'.value-list' container not found in #${subTabName}.`);
        return;
    }

    valueListContainer.innerHTML = '<li>Loading items...</li>'; // Placeholder

    const categoryMap = {
        'CubSkins': 'Cub Skins', 'HiveSkins': 'Hive Skins', 'Vouchers': 'Vouchers',
        'Bees': 'Bees', 'Bears': 'Bears', 'Mobs': 'Mobs', 'Misc': 'Miscellaneous',
        'Art': 'Art', 'Gems': 'Gems', 'NectarIcons': 'Nectar Icons',
        'Flowers': 'Flowers', 'Mushrooms': 'Mushrooms', 'Leaves': 'Leaves',
        'Tools': 'Tools', 'Stamps': 'Stamps', 'Beesmas': 'Beesmas'
    };

    const targetGroup = categoryMap[subTabName];
    if (!targetGroup) {
        valueListContainer.innerHTML = '<li>Invalid category.</li>';
        return;
    }

    const itemsInCategory = Object.values(valueList).filter(item => STICKER_TO_GROUP_MAP[item.key] === targetGroup);

    if (itemsInCategory.length === 0) {
        valueListContainer.innerHTML = '<li>No items found in this category.</li>';
        return;
    }
    
    // Clear placeholder
    valueListContainer.innerHTML = '';

    // Sort items alphabetically by key
    itemsInCategory.sort((a, b) => a.key.localeCompare(b.key));

    const placeholderImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='; // 1x1 transparent gif

    // Create and append list items
    itemsInCategory.forEach(item => {
        const li = document.createElement('li');
        li.className = 'value-item';
        li.onclick = () => openModal(item.key);

        const img = document.createElement('img');
        img.src = placeholderImage; // Start with a placeholder
        img.setAttribute('data-src', item.image || 'https://via.placeholder.com/50?text=?'); // Store real source in data-src
        img.alt = escapeHTML(item.key);
        img.classList.add('lazy-image');

        const span = document.createElement('span');
        span.textContent = escapeHTML(item.key);

        const valueDisplay = document.createElement('div');
        valueDisplay.className = 'value-display';
        
        // FIX: Use .innerHTML to render the <img> tag for dynamic values correctly.
        valueDisplay.innerHTML = formatValueDisplay(item.value_min, item.value_max, item.graph_value);
        
        li.appendChild(img);
        li.appendChild(span);
        li.appendChild(valueDisplay);
        
        valueListContainer.appendChild(li);

        // Tell the IntersectionObserver to watch this image
        observeLazyImage(img);
    });
}

function handleGlobalBeequipSearch() {
    const searchInput = document.getElementById('globalBeequipSearchBar');
    const resultsContainer = document.getElementById('globalBeequipSearchResults');
    const gridContainer = document.getElementById('beequipSelectionGrid');

    if (!searchInput || !resultsContainer || !gridContainer) return;

    const searchTerm = searchInput.value.toLowerCase().trim();

    if (searchTerm.length < 1) {
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
        gridContainer.style.display = 'grid';
        return;
    }

    resultsContainer.style.display = 'block';
    gridContainer.style.display = 'none';

    const searchableBeequips = [];
    for (const itemKey in valueList) {
        const item = valueList[itemKey];
        const categoryLower = (item.category || '').toLowerCase();
        if (categoryLower.includes('beequip') && !categoryLower.includes('group')) {
             const groupName = item.group_ref && valueList[item.group_ref] ? valueList[item.group_ref].key : null;
             searchableBeequips.push({
                 key: itemKey,
                 name: itemKey,
                 value_min: item.value_min,
                 value_max: item.value_max,
                 graph_value: item.graph_value,
                 image: getBeequipDisplayImage(item),
                 groupName: groupName,
                 acronyms: item.acronyms || ''
             });
        }
    }
    
    const fuseOptions = { keys: ['name', 'groupName', 'acronyms'], threshold: 0.4, distance: 80, minMatchCharLength: 1 };
    const fuse = new Fuse(searchableBeequips, fuseOptions);
    const results = fuse.search(searchTerm);

    if (results.length > 0) {
        const ul = document.createElement('ul');
        ul.className = 'value-list';
        results.forEach(result => {
            const item = result.item;
            const li = document.createElement('li');
            li.className = 'value-item search-item';
            li.onclick = () => {
                openBeequipModal(item.key, item.image);
                searchInput.value = '';
                handleGlobalBeequipSearch();
            };
            const displayValue = formatValueDisplay(item.value_min, item.value_max, item.graph_value);
            let displayName = item.key;
            if (item.groupName && item.key.toLowerCase().startsWith(item.groupName.toLowerCase())) {
                displayName = item.key.substring(item.groupName.length).trim();
            }
            if (!displayName) displayName = item.key;
            
            li.innerHTML = `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.key)}" onerror="this.src='https://via.placeholder.com/50?text=?';"><span>${escapeHTML(displayName)} ${item.groupName ? `<em>(${escapeHTML(item.groupName)})</em>` : ''}</span><div class="value-display">${displayValue}</div>`;
            ul.appendChild(li);
        });
        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(ul);
    } else {
        resultsContainer.innerHTML = '<p style="text-align:center; padding:20px;">No beequips found matching that search.</p>';
    }
}

function handleContextualBeequipSearch() {
    const searchInput = document.getElementById('beequipSearchBar');
    const resultsContainer = document.getElementById('beequipSearchResults');
    const variantList = document.getElementById('beequipVariantList');
    
    if (!searchInput || !resultsContainer || !variantList || !currentBeequipGroupKey) return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm.length < 1) {
        resultsContainer.style.display = 'none';
        resultsContainer.innerHTML = '';
        variantList.style.display = 'block';
        return;
    }
    
    resultsContainer.style.display = 'block';
    variantList.style.display = 'none';

    const searchableBeequipsInGroup = [];
    for (const itemKey in valueList) {
        const item = valueList[itemKey];
        if (item.category === 'Beequip' && item.group_ref === currentBeequipGroupKey) {
             searchableBeequipsInGroup.push({
                 key: itemKey,
                 name: itemKey,
                 value_min: item.value_min,
                 value_max: item.value_max,
                 graph_value: item.graph_value,
                 image: getBeequipDisplayImage(item),
                 acronyms: item.acronyms || ''
             });
        }
    }
    
    const fuseOptions = { keys: ['name', 'acronyms'], threshold: 0.4, distance: 80, minMatchCharLength: 1 };
    const fuse = new Fuse(searchableBeequipsInGroup, fuseOptions);
    const results = fuse.search(searchTerm);

    if (results.length > 0) {
        const ul = document.createElement('ul');
        ul.className = 'value-list';
        results.forEach(result => {
            const item = result.item;
            const li = document.createElement('li');
            li.className = 'value-item search-item';
            li.onclick = () => {
                openBeequipModal(item.key, item.image);
                searchInput.value = '';
                handleContextualBeequipSearch();
            };
            const displayValue = formatValueDisplay(item.value_min, item.value_max, item.graph_value);
            let displayName = item.key;
            if (item.key.toLowerCase().startsWith(currentBeequipGroupKey.toLowerCase())) {
                displayName = item.key.substring(currentBeequipGroupKey.length).trim();
            }
            if (!displayName) displayName = item.key;
            
            li.innerHTML = `<img src="${escapeHTML(item.image)}" alt="${escapeHTML(item.key)}" onerror="this.src='https://via.placeholder.com/50?text=?';"><span>${escapeHTML(displayName)}</span><div class="value-display">${displayValue}</div>`;
            ul.appendChild(li);
        });
        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(ul);
    } else {
        resultsContainer.innerHTML = `<p style="text-align:center; padding:10px;">No variants found matching '${escapeHTML(searchTerm)}' in this group.</p>`;
    }
}

function handleBeequipBackNavigation() {
    const backBtn = document.getElementById('backToBeequipSelectionBtn');
    const searchInput = document.getElementById('beequipSearchBar');
    const searchResultsContainer = document.getElementById('beequipSearchResults');

    // NEW: If we are in a search state, "back" should just clear the search and restore the variant list.
    if (searchInput && searchInput.value.trim() !== '' && searchResultsContainer && searchResultsContainer.style.display === 'block') {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input')); // Trigger search function to restore the view
        return;
    }

    if (currentBeequipSubgroupKey) {
        currentBeequipSubgroupKey = null;
        if(backBtn) backBtn.textContent = '← Back to Beequips';
        renderBeequipVariantList(currentBeequipGroupKey);
    } else if (currentBeequipGroupKey) {
        showBeequipSelectionView();
    }
}

function getBeequipSubgroupName(variantKey, groupKey) {
    const lowerVariantKey = variantKey.toLowerCase();
    if (lowerVariantKey.includes('(unwaxed)')) {
        return "Unwaxed";
    }
    
    let details = variantKey.substring(groupKey.length).trim();
    const parts = details.split(',');
    const mainStatGroup = parts[0].trim();

    if (mainStatGroup) {
        return mainStatGroup;
    }
    
    return "Miscellaneous";
}

function compareBeequipVariants(a, b) {
    const regexGBC = /(\d+)\s*GBC/i;
    const regexHB = /\{HB\}\s*(\d+)/i;
    const regexPot = /(\d+)\s*Pot/i;
    const regexFirstNum = /(\d+(\.\d+)?)/;

    const valA_GBC = a.key.match(regexGBC)?.[1] || null;
    const valB_GBC = b.key.match(regexGBC)?.[1] || null;
    if (valA_GBC !== null && valB_GBC !== null) {
        const diff = parseInt(valA_GBC) - parseInt(valB_GBC);
        if (diff !== 0) return diff;
    }

    const valA_HB = a.key.match(regexHB)?.[1] || null;
    const valB_HB = b.key.match(regexHB)?.[1] || null;
    if (valA_HB !== null && valB_HB !== null) {
        const diff = parseInt(valA_HB) - parseInt(valB_HB);
        if (diff !== 0) return diff;
    }
    
    const valA_Pot = a.key.match(regexPot)?.[1] || null;
    const valB_Pot = b.key.match(regexPot)?.[1] || null;
    if (valA_Pot !== null && valB_Pot !== null) {
        const diff = parseInt(valA_Pot) - parseInt(valB_Pot);
        if (diff !== 0) return diff;
    }

    const valA_firstNum = a.key.match(regexFirstNum)?.[1] || null;
    const valB_firstNum = b.key.match(regexFirstNum)?.[1] || null;
    if (valA_firstNum !== null && valB_firstNum !== null) {
        const diff = parseFloat(valA_firstNum) - parseFloat(valB_firstNum);
        if (diff !== 0) return diff > 0 ? 1 : -1;
    }

    return a.key.localeCompare(b.key);
}

function applyMasonryLayout(container) {
    if (!container) return;

    // Ensure container is visible before calculating item heights
    const wasHidden = container.style.display === 'none';
    if (wasHidden) {
        container.style.display = 'grid'; // Or whatever its default display is
        // It might be necessary to force a reflow here if direct children are also display:none
    }

    const items = Array.from(container.querySelectorAll('.item-wrapper'));
    const style = getComputedStyle(container);
    // Use 1px as the base unit for row calculation
    const gridRowHeight = 1; 
    const gridRowGap = parseInt(style.getPropertyValue('gap')) || 0;

    items.forEach(item => {
        const itemHeight = item.offsetHeight;
        // The formula for spanning must account for the gap between rows
        const rowSpan = Math.ceil((itemHeight + gridRowGap) / (gridRowHeight + gridRowGap));
        item.style.gridRowEnd = `span ${rowSpan}`;
    });

    if (wasHidden) {
        container.style.display = 'none'; // Restore if it was hidden
    }
}

// --- Trade Offer Save/Load Logic ---
let currentSaveLoadMode = 'save'; // 'save' or 'load'
const MAX_TRADE_OFFER_SLOTS = 3;

function openTradeOfferSaveLoadModal(mode) {
    if (!currentUser) {
        alert("Please log in to manage saved offers.");
        return;
    }
    if (currentUser.banned) {
        showBanOverlay(currentUser.reason || "Your account is restricted.");
        return;
    }

    currentSaveLoadMode = mode;
    const modal = document.getElementById('tradeOfferSaveLoadModal');
    const titleEl = document.getElementById('tradeOfferSaveLoadModalTitle');
    const nameInputContainer = document.getElementById('tradeOfferSaveNameInputContainer');
    const messageBox = document.getElementById('tradeOfferSaveLoadMessage');

    if (!modal || !titleEl || !nameInputContainer || !messageBox) {
        console.error("Save/Load modal elements not found!");
        return;
    }

    titleEl.textContent = mode === 'save' ? "Save Trade Offer" : "Load Trade Offer";
    nameInputContainer.style.display = mode === 'save' ? 'block' : 'none';
    if (mode === 'save') {
        const nameInput = document.getElementById('tradeOfferSaveName');
        if(nameInput) nameInput.value = ''; // Clear previous name
    }
    messageBox.textContent = '';
    modal.style.display = 'block';
    fetchAndRenderTradeOfferSlots();
}

function closeTradeOfferSaveLoadModal() {
    const modal = document.getElementById('tradeOfferSaveLoadModal');
    if (modal) modal.style.display = 'none';
}

async function fetchAndRenderTradeOfferSlots() {
    const slotsContainer = document.getElementById('tradeOfferSaveLoadSlotsContainer');
    const messageBox = document.getElementById('tradeOfferSaveLoadMessage');
    if (!slotsContainer || !messageBox) return;

    slotsContainer.innerHTML = '<p>Loading slots...</p>';
    messageBox.textContent = '';

    try {
        const response = await fetch('/api/trade_offers/slots', { credentials: 'include' });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Failed to fetch slots." }));
            throw new Error(errorData.error || `HTTP error ${response.status}`);
        }
        const slots = await response.json();
        renderTradeOfferSlots(slots);
    } catch (error) {
        console.error("Error fetching trade offer slots:", error);
        slotsContainer.innerHTML = `<p style="color:red;">Error: ${escapeHTML(error.message)}</p>`;
    }
}

function renderTradeOfferSlots(slots) {
    const slotsContainer = document.getElementById('tradeOfferSaveLoadSlotsContainer');
    if (!slotsContainer) return;
    slotsContainer.innerHTML = '';

    if (!slots || slots.length === 0) {
        slotsContainer.innerHTML = '<p>No save slots available.</p>';
        return;
    }

    slots.forEach(slot => {
        const slotDiv = document.createElement('div');
        slotDiv.className = 'save-load-slot';
        if (!slot.offer_name && !slot.saved_at) {
            slotDiv.classList.add('empty-slot');
        }

        const slotInfo = document.createElement('div');
        slotInfo.className = 'slot-info';
        const slotName = slot.offer_name ? escapeHTML(slot.offer_name) : 'Empty Slot';
        const savedAt = slot.saved_at ? `Saved: ${formatDate(slot.saved_at)}` : 'Click the save icon to use this slot.';
        slotInfo.innerHTML = `<strong>Slot ${slot.slot_id}: ${slotName}</strong><small>${savedAt}</small>`;
        slotDiv.appendChild(slotInfo);

        const slotActions = document.createElement('div');
        slotActions.className = 'slot-actions';

        if (currentSaveLoadMode === 'save') {
            const saveButton = document.createElement('button');
            saveButton.className = 'slot-action-btn slot-save-btn';
            saveButton.title = 'Save to this slot';
            saveButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"></path></svg>`;
            saveButton.onclick = () => saveCurrentTradeOffer(slot.slot_id);
            slotActions.appendChild(saveButton);
        } else { // mode === 'load'
            if (slot.offer_name || slot.saved_at) { // If slot is not empty
                const loadButton = document.createElement('button');
                loadButton.className = 'slot-action-btn slot-load-btn';
                loadButton.title = 'Load this offer';
                loadButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 20h14v-2H5v2zm14-12v4h-2V8H7v4H5V8l7-7 7 7z"></path></svg>`;
                loadButton.onclick = () => loadTradeOfferFromSlot(slot.slot_id);
                slotActions.appendChild(loadButton);
            }
        }

        if (slot.offer_name || slot.saved_at) { // If slot is not empty, allow delete
            const deleteButton = document.createElement('button');
            deleteButton.className = 'slot-action-btn slot-delete-btn';
            deleteButton.title = 'Delete this saved offer';
            deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`;
            deleteButton.onclick = () => deleteTradeOfferSlot(slot.slot_id);
            slotActions.appendChild(deleteButton);
        }
        
        slotDiv.appendChild(slotActions);
        slotsContainer.appendChild(slotDiv);
    });
}   

async function saveCurrentTradeOffer(slotId) {
    const offerNameInput = document.getElementById('tradeOfferSaveName');
    const offerName = offerNameInput ? offerNameInput.value.trim() : null;
    const messageBox = document.getElementById('tradeOfferSaveLoadMessage');

    if (!messageBox) return;
    messageBox.textContent = 'Saving...';
    messageBox.style.color = 'var(--text-color)';

    const payload = {
        slot_id: slotId,
        offer_name: offerName,
        your_offer_items: tradeOfferYourItems,
        their_offer_items: tradeOfferTheirItems
    };

    try {
        const response = await fetch('/api/trade_offers/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || `HTTP error ${response.status}`);
        }
        messageBox.textContent = result.message || 'Offer saved successfully!';
        messageBox.style.color = 'green';
        fetchAndRenderTradeOfferSlots(); // Refresh slot display
        if(offerNameInput) offerNameInput.value = ''; // Clear name input after successful save
    } catch (error) {
        console.error("Error saving trade offer:", error);
        messageBox.textContent = `Error: ${escapeHTML(error.message)}`;
        messageBox.style.color = 'red';
    }
}

async function loadTradeOfferFromSlot(slotId) {
    const messageBox = document.getElementById('tradeOfferSaveLoadMessage');
    if (!messageBox) return;

    messageBox.textContent = 'Loading...';
    messageBox.style.color = 'var(--text-color)';

    try {
        const response = await fetch(`/api/trade_offers/load?slot_id=${slotId}`, { credentials: 'include' });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || `HTTP error ${response.status}`);
        }

        tradeOfferYourItems = data.your_offer_items || [];
        tradeOfferTheirItems = data.their_offer_items || [];
        
        renderTradeOfferItems();
        updateTradeOfferResults();

        messageBox.textContent = `Offer from slot ${slotId} ( "${escapeHTML(data.offer_name || 'Unnamed')}" ) loaded!`;
        messageBox.style.color = 'green';
        setTimeout(closeTradeOfferSaveLoadModal, 1500); // Close modal on success
    } catch (error) {
        console.error("Error loading trade offer:", error);
        messageBox.textContent = `Error: ${escapeHTML(error.message)}`;
        messageBox.style.color = 'red';
    }
}

async function deleteTradeOfferSlot(slotId) {
    const messageBox = document.getElementById('tradeOfferSaveLoadMessage');
    if (!messageBox) return;

    if (!confirm(`Are you sure you want to delete the offer in Slot ${slotId}? This cannot be undone.`)) {
        return;
    }

    messageBox.textContent = 'Deleting...';
    messageBox.style.color = 'var(--text-color)';

    try {
        const response = await fetch(`/api/trade_offers/delete?slot_id=${slotId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || `HTTP error ${response.status}`);
        }
        messageBox.textContent = result.message || 'Offer deleted successfully!';
        messageBox.style.color = 'green';
        fetchAndRenderTradeOfferSlots(); // Refresh slot display
    } catch (error) {
        console.error("Error deleting trade offer:", error);
        messageBox.textContent = `Error: ${escapeHTML(error.message)}`;
        messageBox.style.color = 'red';
    }
}

function clearCurrentTradeOffer() {
    if (!confirm("Are you sure you want to clear the current trade offer? This will remove all items from both sides.")) {
        return;
    }
    tradeOfferYourItems = [];
    tradeOfferTheirItems = [];
    renderTradeOfferItems();
    updateTradeOfferResults();
    const yourIndicator = document.querySelector('#main-offer-your .custom-value-indicator');
    const theirIndicator = document.querySelector('#main-offer-their .custom-value-indicator');
    if(yourIndicator) yourIndicator.style.display = 'none';
    if(theirIndicator) theirIndicator.style.display = 'none';
    
    // Also clear any highlights or custom texts if they are stored directly on the items
    // This is implicitly handled by re-initializing the arrays.
}

document.addEventListener('DOMContentLoaded', function() {
    // ... (existing DOMContentLoaded listeners) ...

    const btnOpenSaveModal = document.getElementById('btnOpenSaveOfferModal');
    const btnOpenLoadModal = document.getElementById('btnOpenLoadOfferModal');
    const btnClearOffer = document.getElementById('btnClearTradeOffer');
    const closeSaveLoadModalBtn = document.getElementById('closeTradeOfferSaveLoadModal');

    if(btnOpenSaveModal) btnOpenSaveModal.addEventListener('click', () => openTradeOfferSaveLoadModal('save'));
    if(btnOpenLoadModal) btnOpenLoadModal.addEventListener('click', () => openTradeOfferSaveLoadModal('load'));
    if(btnClearOffer) btnClearOffer.addEventListener('click', clearCurrentTradeOffer);
    if(closeSaveLoadModalBtn) closeSaveLoadModalBtn.addEventListener('click', closeTradeOfferSaveLoadModal);
    
    // Close modal on escape key
    window.addEventListener('keydown', function(event) {
        const saveLoadModal = document.getElementById('tradeOfferSaveLoadModal');
        if (event.key === 'Escape' && saveLoadModal && saveLoadModal.style.display === 'block') {
            closeTradeOfferSaveLoadModal();
        }
    });
});


function closeChartContextMenu() {
    const existingMenu = document.getElementById('chart-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    document.body.removeEventListener('click', closeChartContextMenu);
}

function showChartContextMenu(event, chart, elements) {
    if (!currentUser || !currentUser.is_admin) return;
    if (elements.length === 0) return;

    closeChartContextMenu(); // Close any existing menu

    const element = elements[0];
    const datasetIndex = element.datasetIndex;
    const index = element.index;
    const dataset = chart.data.datasets[datasetIndex];
    const dataPoint = dataset.data[index];
    const itemName = currentOpenModalItemName; // This is globally available when modal is open

    if (!itemName || !dataPoint) return;

    const date = dataPoint.x;
    const currentValue = dataPoint.y;
    const datasetType = dataset.label.toLowerCase().includes('demand') ? 'demand' : 'value';

    const menu = document.createElement('div');
    menu.id = 'chart-context-menu';
    menu.style.position = 'fixed';
    menu.style.left = `${event.native.clientX}px`;
    menu.style.top = `${event.native.clientY}px`;

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit Point';
    editButton.onclick = (e) => {
        e.stopPropagation();
        adminEditHistoryPoint(itemName, date, datasetType, currentValue);
        closeChartContextMenu();
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Point';
    deleteButton.onclick = (e) => {
        e.stopPropagation();
        adminDeleteHistoryPoint(itemName, date);
        closeChartContextMenu();
    };

    menu.appendChild(editButton);
    menu.appendChild(deleteButton);
    document.body.appendChild(menu);

    // Add a listener to close the menu if clicking outside of it
    setTimeout(() => {
        document.body.addEventListener('click', closeChartContextMenu, { once: true });
    }, 0);
}

async function adminEditHistoryPoint(itemName, date, datasetType, currentValue) {
    const newValueStr = prompt(`Editing ${datasetType} for ${itemName} on ${date}.\n\nEnter new value:`, currentValue);

    if (newValueStr === null || newValueStr.trim() === '') {
        return;
    }

    const newValue = parseFloat(newValueStr);
    if (isNaN(newValue)) {
        alert("Invalid number provided.");
        return;
    }

    toggleLoadingIndicator(true);
    try {
        const response = await fetch('/api/admin/item/history/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                item_key: itemName,
                date: date,
                dataset_type: datasetType,
                new_value: newValue
            }),
            credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to update history point.');

        alert(result.message);
        // Refetch and reopen modal to see updated chart
        await fetchValues();
        if (currentOpenModalItemName === itemName) {
            closeItemModal();
            openModal(itemName);
        }
    } catch (error) {
        console.error("Error updating history point:", error);
        alert(`Error: ${error.message}`);
    } finally {
        toggleLoadingIndicator(false);
    }
}

async function adminDeleteHistoryPoint(itemName, date) {
    if (!confirm(`Are you sure you want to delete the data point for ${itemName} on ${date}? This cannot be undone.`)) {
        return;
    }

    toggleLoadingIndicator(true);
    try {
        const response = await fetch('/api/admin/item/history/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                item_key: itemName,
                date: date
            }),
            credentials: 'include'
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Failed to delete history point.');

        alert(result.message);
        // Refetch and reopen modal to see updated chart
        await fetchValues();
        if (currentOpenModalItemName === itemName) {
            closeItemModal();
            openModal(itemName);
        }
    } catch (error) {
        console.error("Error deleting history point:", error);
        alert(`Error: ${error.message}`);
    } finally {
        toggleLoadingIndicator(false);
    }
}

function createPriceChart(itemName) {
    if (priceChartInstance) priceChartInstance.destroy();

    fetch(`/values/${itemName}`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById('priceChart');
            if (!ctx) return;

            const hasPriceData = data.prices && data.prices.length > 0;
            const hasDemandData = data.demand_prices && data.demand_prices.length > 0;

            if (!hasPriceData && !hasDemandData) {
                ctx.style.display = 'none';
                console.warn("No price or demand data for chart or canvas not found for:", itemName);
                return;
            }
            
            ctx.style.display = 'block';

            let datasets = [];
            const isDarkMode = document.body.classList.contains('dark-mode');
            const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
            const ticksColor = isDarkMode ? '#ccc' : '#666';

            let scales = {
                x: {
                    type: 'time',
                    time: { unit: 'day' },
                    grid: { color: gridColor },
                    ticks: { color: ticksColor }
                }
            };

            if (hasPriceData) {
                datasets.push({
                    label: 'Avg. Value (Signs)',
                    data: data.prices,
                    borderColor: 'rgb(52, 152, 219)',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    tension: 0.1,
                    yAxisID: 'y_value'
                });
                scales.y_value = {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Value (Signs)',
                        color: 'rgb(52, 152, 219)'
                    },
                    grid: { color: gridColor },
                    ticks: { color: 'rgb(52, 152, 219)' }
                };
            }

            if (hasDemandData) {
                datasets.push({
                    label: 'Demand (0-5)',
                    data: data.demand_prices,
                    borderColor: 'rgb(230, 126, 34)',
                    backgroundColor: 'rgba(230, 126, 34, 0.2)',
                    tension: 0.1,
                    yAxisID: 'y_demand'
                });
                scales.y_demand = {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    min: 0,
                    max: 5,
                    title: {
                        display: true,
                        text: 'Demand',
                        color: 'rgb(230, 126, 34)'
                    },
                    grid: { drawOnChartArea: false },
                    ticks: { color: 'rgb(230, 126, 34)', stepSize: 1 }
                };
            }
            
            const chartOptions = {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                scales: scales,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) label += ': ';
                                if (context.parsed.y !== null) {
                                    if (context.dataset.yAxisID === 'y_demand') {
                                        label += context.parsed.y.toFixed(1);
                                    } else {
                                        label += `${context.parsed.y.toFixed(2)} Signs`;
                                    }
                                }
                                return label;
                            }
                        }
                    },
                    legend: {
                        labels: {
                            color: ticksColor
                        }
                    }
                },
                // NEW: onClick handler for admin actions
                onClick: (event, elements, chart) => {
                    if (currentUser && currentUser.is_admin) {
                         const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
                         if (points.length) {
                             showChartContextMenu(event, chart, points);
                         }
                    }
                },
                onHover: (event, chartElement, chart) => {
                    if (currentUser && currentUser.is_admin) {
                        const canvas = chart.canvas;
                        canvas.style.cursor = chartElement[0] ? 'pointer' : 'default';
                    }
                }
            };
            
            priceChartInstance = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: { datasets: datasets },
                options: chartOptions
            });
        })
        .catch(error => console.error('Error fetching price chart data:', error));
}

function renderSecureValue(targetElement, value) {
    if (!targetElement) return;
    targetElement.innerHTML = ''; // Clear previous content

    const formattedValue = value.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    for (const char of formattedValue) {
        const span = document.createElement('span');
        span.classList.add('secure-digit-img');

        switch (char) {
            case '0': span.classList.add('s-digit-0'); break;
            case '1': span.classList.add('s-digit-1'); break;
            case '2': span.classList.add('s-digit-2'); break;
            case '3': span.classList.add('s-digit-3'); break;
            case '4': span.classList.add('s-digit-4'); break;
            case '5': span.classList.add('s-digit-5'); break;
            case '6': span.classList.add('s-digit-6'); break;
            case '7': span.classList.add('s-digit-7'); break;
            case '8': span.classList.add('s-digit-8'); break;
            case '9': span.classList.add('s-digit-9'); break;
            case ',': span.classList.add('s-comma'); break;
            case '.': span.classList.add('s-dot'); break;
        }
        targetElement.appendChild(span);
    }
}


console.log("v8")