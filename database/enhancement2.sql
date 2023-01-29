-- Inserting new record
INSERT INTO client (client_firstname,client_lastname,client_email,client_password)
	VALUES('Tony','Stark','tony@starkent.com','Iam1ronM@n');

-- Changing client_type to admin
UPDATE client SET client_type = 'Admin' WHERE client_id =1;  

-- Deleting Tony from database
DELETE FROM client WHERE client_id =1;

-- Replacing small interiors with HUGE interiors
UPDATE inventory
SET inv_description = replace(inv_description,'small interior','HUGE interior')
WHERE inv_make = 'GM';	

-- Using inner join to find sport's category
SELECT inv_make,inv_model,classification.classification_name
FROM inventory
INNER JOIN classification
ON inventory.classification_id = classification.classification_id
WHERE classification_name ='Sport';

-- Update all records in the inventory table to add "/vehicles" to the middle of the file path

UPDATE inventory
SET inv_image = CONCAT(SUBSTRING(inv_image, 1, (position('/' in inv_image)+1)), '/vehicles/', SUBSTRING(inv_image, (position('/' in inv_image)+1))),
    inv_thumbnail = CONCAT(SUBSTRING(inv_thumbnail, 1, (position('/' in inv_thumbnail)+1)), '/vehicles/', SUBSTRING(inv_thumbnail, (position('/' in inv_thumbnail)+1)));
