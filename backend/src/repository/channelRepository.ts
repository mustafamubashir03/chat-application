import Channel from '../schema/channel';
import crudRepository from './crudRepository';

const channelRepository = {
  ...crudRepository<any>(Channel)
};

export default channelRepository;
