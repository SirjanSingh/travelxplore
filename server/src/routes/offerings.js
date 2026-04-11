const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/schema');
const { requireHost } = require('../middleware/auth');

const router = express.Router();

// Public: list with filters
router.get('/', (req, res) => {
  const { location, type, search } = req.query;
  let items = db.get('offerings').value();

  if (items.length === 0) {
    items = [
      { id: 'mock-1', host_id: 'mock-host-1', title: 'Heritage Haveli Stay', description: 'Experience royalty in our restored heritage haveli. Features authentic courtyards, traditional Rajasthani architecture, and modern comforts. Breakfast included.', type: 'stay', price: 3500, location: 'Jaipur, Rajasthan', images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'], max_guests: 4 },
      { id: 'mock-stay-2', host_id: 'mock-host-4', title: 'Goan Beachfront Villa', description: 'A relaxing beachfront stay in South Goa with a private pool, sun loungers, and direct beach access. Perfect for families or groups.', type: 'stay', price: 8000, location: 'Palolem, Goa', images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'], max_guests: 8 },
      { id: 'mock-stay-3', host_id: 'mock-host-5', title: 'Cozy Himalayan Cottage', description: 'Wake up to panoramic views of the Himalayas in this rustic, cozy wooden cottage equipped with a fireplace and warm interiors.', type: 'stay', price: 4200, location: 'Shimla, Himachal Pradesh', images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'], max_guests: 2 },
      { id: 'mock-stay-4', host_id: 'mock-host-6', title: 'Kerala Backwater Houseboat', description: 'Drift through the serene backwaters of Alleppey on a traditional fully-furnished houseboat. Includes all meals prepared by an onboard chef.', type: 'stay', price: 12000, location: 'Alleppey, Kerala', images: ['https://images.unsplash.com/photo-1593693397690-362cb9666c6b?w=800&q=80'], max_guests: 6 },
      { id: 'mock-2', host_id: 'mock-host-2', title: 'Authentic Kerelan Sadhya Cooking', description: 'Cook and eat a traditional Kerelan Sadhya served on a plantain leaf. Learn about the 26 different dishes and their significance.', type: 'cuisine', price: 1200, location: 'Kochi, Kerala', images: ['https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80'], max_guests: 6 },
      { id: 'mock-cuisine-2', host_id: 'mock-host-7', title: 'Delhi Street Food Walk', description: 'Explore the bustling streets of Chandni Chowk and taste the best chaat, parathas, and jalebis in Old Delhi safely with a local guide.', type: 'cuisine', price: 1500, location: 'New Delhi', images: ['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80'], max_guests: 10 },
      { id: 'mock-cuisine-3', host_id: 'mock-host-8', title: 'Nawabi Awadhi Feast', description: 'Dine like royalty with a meticulously prepared Awadhi feast in a historic Lucknow home. Features Galouti kebabs and Dum Biryani.', type: 'cuisine', price: 2500, location: 'Lucknow, UP', images: ['https://images.unsplash.com/photo-1476224203421-9ac39bcb3df1?w=800&q=80'], max_guests: 4 },
      { id: 'mock-cuisine-4', host_id: 'mock-host-9', title: 'Punjabi Dhaba Experience', description: 'Get a rustic dining experience eating authentic Punjabi makki di roti, sarson da saag, and rich lassi at a working farm.', type: 'cuisine', price: 900, location: 'Amritsar, Punjab', images: ['https://images.unsplash.com/photo-1512485800893-b08ec1ea59b1?w=800&q=80'], max_guests: 15 },
      { id: 'mock-3', host_id: 'mock-host-3', title: 'Himalayan Trekking Experience', description: 'A 3-day guided trek through the breathtaking trails of the Himalayas. Test your endurance while safely scaling beautiful peaks.', type: 'experience', price: 6500, location: 'Manali, Himachal Pradesh', images: ['https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80'], max_guests: 10 },
      { id: 'mock-exp-2', host_id: 'mock-host-10', title: 'Pottery Workshop in Dharavi', description: 'Learn the ancient art of pottery from a 3rd generation artisan in Kumbharwada, Dharavi. Take your creations home.', type: 'experience', price: 1200, location: 'Mumbai, Maharashtra', images: ['https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?w=800&q=80'], max_guests: 5 },
      { id: 'mock-exp-3', host_id: 'mock-host-11', title: 'Scuba Diving at Havelock', description: 'Discover pristine coral reefs and exotic marine life with PADI certified instructors in the clear waters of Andaman.', type: 'experience', price: 4500, location: 'Havelock, Andaman', images: ['https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80'], max_guests: 4 },
      { id: 'mock-exp-4', host_id: 'mock-host-12', title: 'Classical Dance Masterclass', description: 'An introductory masterclass into the expressive storytelling of Bharatanatyam with a seasoned performer.', type: 'experience', price: 2000, location: 'Chennai, Tamil Nadu', images: ['https://images.unsplash.com/photo-1519682577862-22b62b24cb12?w=800&q=80'], max_guests: 8 },
    ];
    db.get('hosts').push(
      { id: 'mock-host-1', name: 'Rajveer Singh', location: 'Jaipur', bio: 'A passionate host preserving Rajasthani heritage.' },
      { id: 'mock-host-4', name: 'Althea D\'Souza', location: 'Palolem', bio: 'Loves the ocean, yoga and hosting people from all over.' },
      { id: 'mock-host-5', name: 'Kabir Suri', location: 'Shimla', bio: 'Mountain lover who traded city life for pine trees.' },
      { id: 'mock-host-6', name: 'Thomas Chacko', location: 'Alleppey', bio: 'Third generation boatman and local storyteller.' },
      { id: 'mock-host-2', name: 'Anjali Menon', location: 'Kochi', bio: 'Culinary expert serving age old recipes.' },
      { id: 'mock-host-7', name: 'Vikram Chawla', location: 'New Delhi', bio: 'Food blogger and Old Delhi connoisseur.' },
      { id: 'mock-host-8', name: 'Nawab Saif', location: 'Lucknow', bio: 'Showcasing the declining royal cuisine of Awadh.' },
      { id: 'mock-host-9', name: 'Gurmukh Singh', location: 'Amritsar', bio: 'A proud farmer who loves to feed people.' },
      { id: 'mock-host-3', name: 'Tenzin Dorjee', location: 'Manali', bio: 'Certified mountaineer and guide.' },
      { id: 'mock-host-10', name: 'Ramesh Kumhar', location: 'Mumbai', bio: 'Artisan keeping the Dharavi pottery traditions alive.' },
      { id: 'mock-host-11', name: 'Elena Dive', location: 'Havelock', bio: 'PADI Master instructor with 15 years experience.' },
      { id: 'mock-host-12', name: 'Shruti Iyer', location: 'Chennai', bio: 'Trained Bharatanatyam dancer and instructor.' }
    ).write();
    // Save to db
    db.get('offerings').push(...items).write();
  }

  if (location) items = items.filter(o => o.location?.toLowerCase().includes(location.toLowerCase()));
  if (type && type !== 'all') items = items.filter(o => o.type === type);
  if (search) items = items.filter(o =>
    o.title?.toLowerCase().includes(search.toLowerCase()) ||
    o.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Attach host info
  const hosts = db.get('hosts').value();
  items = items.map(o => {
    const h = hosts.find(h => h.id === o.host_id) || {};
    return { ...o, host_name: h.name, host_location: h.location, host_bio: h.bio };
  });

  res.json(items.reverse());
});

// Public: single offering
router.get('/host/mine', requireHost, (req, res) => {
  const items = db.get('offerings').filter({ host_id: req.user.id }).value();
  res.json([...items].reverse());
});

router.get('/:id', (req, res) => {
  const o = db.get('offerings').find({ id: req.params.id }).value();
  if (!o) return res.status(404).json({ error: 'Offering not found' });
  const h = db.get('hosts').find({ id: o.host_id }).value() || {};
  res.json({ ...o, host_name: h.name, host_location: h.location, host_bio: h.bio, host_avatar: h.avatar });
});

// Create (host)
router.post('/', requireHost, (req, res) => {
  const { title, description, type, price, location, images, available_from, available_to, max_guests, is_customizable, customization_note } = req.body;
  if (!title || !description || !type || !price || !location) return res.status(400).json({ error: 'Required fields missing' });

  const id = uuidv4();
  const offering = {
    id, host_id: req.user.id, title, description, type,
    price: parseFloat(price), location,
    images: images || [],
    available_from: available_from || null, available_to: available_to || null,
    max_guests: parseInt(max_guests) || 1,
    is_customizable: !!is_customizable,
    customization_note: customization_note || null,
    created_at: new Date().toISOString(),
  };
  db.get('offerings').push(offering).write();
  res.status(201).json(offering);
});

// Update (host, own)
router.put('/:id', requireHost, (req, res) => {
  const o = db.get('offerings').find({ id: req.params.id }).value();
  if (!o) return res.status(404).json({ error: 'Not found' });
  if (o.host_id !== req.user.id) return res.status(403).json({ error: 'Not your offering' });

  const { title, description, type, price, location, images, available_from, available_to, max_guests, is_customizable, customization_note } = req.body;
  const update = {};
  if (title !== undefined) update.title = title;
  if (description !== undefined) update.description = description;
  if (type !== undefined) update.type = type;
  if (price !== undefined) update.price = parseFloat(price);
  if (location !== undefined) update.location = location;
  if (images !== undefined) update.images = images;
  if (available_from !== undefined) update.available_from = available_from;
  if (available_to !== undefined) update.available_to = available_to;
  if (max_guests !== undefined) update.max_guests = parseInt(max_guests);
  if (is_customizable !== undefined) update.is_customizable = !!is_customizable;
  if (customization_note !== undefined) update.customization_note = customization_note;

  db.get('offerings').find({ id: req.params.id }).assign(update).write();
  res.json(db.get('offerings').find({ id: req.params.id }).value());
});

// Delete (host, own)
router.delete('/:id', requireHost, (req, res) => {
  const o = db.get('offerings').find({ id: req.params.id }).value();
  if (!o) return res.status(404).json({ error: 'Not found' });
  if (o.host_id !== req.user.id) return res.status(403).json({ error: 'Not your offering' });

  db.get('bookings').remove({ offering_id: req.params.id }).write();
  db.get('offerings').remove({ id: req.params.id }).write();
  res.json({ message: 'Deleted' });
});

module.exports = router;
