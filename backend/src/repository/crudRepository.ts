import mongoose, { Document, Model } from 'mongoose';

export default function crudRepository<T extends Document>(schema: Model<T>) {
  return {
    createDoc: async (data: T) => {
      const createDoc = await schema.create(data);
      return createDoc;
    },
    getDocById: async (id: mongoose.Types.ObjectId) => {
      const docById = await schema.findById(id);
      return docById;
    },
    getDocs: async () => {
      const docs = await schema.find();
      return docs;
    },
    updateDoc: async (id: mongoose.Types.ObjectId, newData: any) => {
      const updateDoc = await schema.findByIdAndUpdate(id, newData, {
        new: true
      });
      return updateDoc;
    },
    deleteDoc: async (id: mongoose.Types.ObjectId) => {
      const deleteDoc = await schema.findByIdAndDelete(id);
      return deleteDoc;
    },
    deleteAllDocs: async (ids: mongoose.Types.ObjectId[]) => {
      const response = await schema.deleteMany({ _id: { $in: ids } });
      return response;
    }
  };
}
