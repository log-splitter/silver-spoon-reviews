class Restaurant < ApplicationRecord
  validates :name, presence: true
  validates :address, presence: true
  validates :neighborhood, presence: true
  validates :phone, presence: true
end
