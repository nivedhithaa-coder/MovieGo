import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
    movie: {
        type: String,
        ref: 'Movie',
        required: true,
      },
      
  title: { type: String, required: true },
  showDateTime: { type: Date, required: true },
  showPrice: { type: Number, required: true },
  occupiedSeats: { type: Object, default: {} },
}, { minimize: false });

const Show = mongoose.model('Show', showSchema);

export default Show;
