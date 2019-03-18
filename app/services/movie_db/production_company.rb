module MovieDb
  class ProductionCompany < Base
    attr_accesor :id, 
                 :logo_path, 
                 :name, 
                 :origin_country
  end
end
