import React from 'react';

// Components
import { EmptySearch } from './EmptySearch';
import {
  ResultsWrapper,
  Entry,
  EntryInfo,
  EntryAdress,
  EntryName,
} from './SearchResults.styled';

export const SearchResults = ({ setRequestData, searchResults }) => {
  return (
    <>
      {!!searchResults && (
        <ResultsWrapper>
          {searchResults.length > 0 ? (
            searchResults.map(entry => (
              <Entry
                key={entry.groupId}
                data-cy={`group_${entry.name}`}
                onClick={() => setRequestData(entry)}
              >
                <EntryInfo>
                  <EntryName>{entry.name}</EntryName>
                  <EntryAdress>
                    {`${entry.baseLocation.streetName} ${entry.baseLocation.streetNr}, ${entry.baseLocation.zipCode} ${entry.baseLocation.city}`}
                  </EntryAdress>
                </EntryInfo>
              </Entry>
            ))
          ) : (
            <EmptySearch />
          )}
        </ResultsWrapper>
      )}
    </>
  );
};
