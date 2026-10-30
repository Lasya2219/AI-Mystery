import mongoose, { Schema } from 'mongoose';
const CaseSchema = new Schema({ _id: { type: String }, data: { type: Schema.Types.Mixed, required: true }, expiresAt: { type: Date, index: { expires: 0 } } }, { versionKey: false });
const PlaythroughSchema = new Schema({ _id: { type: String }, data: { type: Schema.Types.Mixed, required: true }, tokenHash: { type: String, required: true, unique: true }, expiresAt: { type: Date, index: { expires: 0 } } }, { versionKey: false });
export const CaseModel = mongoose.models.MysteryCase ?? mongoose.model('MysteryCase', CaseSchema);
export const PlaythroughModel = mongoose.models.Playthrough ?? mongoose.model('Playthrough', PlaythroughSchema);
